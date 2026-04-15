import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";
import Habit from "@/models/habit";
import HabitLog from "@/models/habitLog";
import Month from "@/models/month";
import {
  getSubscriptionSnapshot,
  incrementAITipsUsage,
} from "@/lib/subscription";
import {
  sendAITipsLowRemainingEmail,
  sendSubscriptionExpiryReminderEmail,
} from "@/services/mailServices";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildHabitContext({
  monthName,
  year,
  habits,
  logs,
  daysInMonth,
  monthDoc,
}) {
  const totalHabits = habits.length;
  const completedCount = logs.length;
  const completionRate =
    totalHabits * daysInMonth > 0
      ? Math.round((completedCount / (totalHabits * daysInMonth)) * 100)
      : 0;
  const activeDays = new Set(
    logs.map((l) => new Date(l.date).toISOString().slice(0, 10)),
  ).size;

  const habitLines = habits.map((h) => {
    const hCount = logs.filter(
      (l) => l.habitId.toString() === h._id.toString(),
    ).length;
    const pct = daysInMonth > 0 ? Math.round((hCount / daysInMonth) * 100) : 0;
    return `${h.name}: ${hCount} completed days (${pct}%)`;
  });

  const categories = habits.reduce((acc, h) => {
    const k = h.category || "General";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const topCategory =
    Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

  return `MONTH: ${monthName} ${year}\nTOTAL_HABITS: ${totalHabits}\nCOMPLETION_RATE: ${completionRate}%\nACTIVE_DAYS: ${activeDays} / ${daysInMonth}\nTOP_CATEGORY: ${topCategory}\nGOAL: ${monthDoc?.goalTitle || "None"}\nHABIT_BREAKDOWN:\n${habitLines.join("\n")}`;
}

async function generateGroqSummary(
  contextText,
  { strict = false, temperature = 0.15 } = {},
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }

  const systemPromptBase = `You are a concise, professional habit coach.
Return ONLY valid JSON with this structure:

{
  "summary": "one short paragraph, max 40-50 words",
  "tips": [
    {"title":"short title, 3-6 words","detail":"a motivating, actionable paragraph of 4-5 short sentences (concise, specific)"},
    {"title":"...","detail":"..."},
    {"title":"...","detail":"..."}
  ]
}

Rules:
- Exactly 3 tips when possible
- Titles: 3-6 words, concise
- Detail: 4-5 short sentences (each sentence 8-20 words), clearly actionable and motivational
- Tone: encouraging and professional
- No markdown, no explanations, only JSON output.`;

  const systemPromptStrict = `Return ONLY valid JSON with this structure:

{
  "summary": "one short paragraph, max 40-50 words",
  "tips": [
    {"title":"short title, 3-6 words","detail":"a motivating, actionable paragraph of 4-5 short sentences (concise, specific)"},
    {"title":"...","detail":"..."},
    {"title":"...","detail":"..."}
  ]
}

Rules:
- Exactly 3 tip objects
- Each tip.detail must be 4-5 short sentences (8-20 words each)
- Do NOT include any text outside the JSON
- Use encouraging, specific language`;

  const systemPrompt = strict ? systemPromptStrict : systemPromptBase;

  const userPrompt = `Context:\n${contextText}\n\nProduce exactly three tip objects; each tip.detail must be a short paragraph of 4-5 concise sentences (motivational and actionable).`;

  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: 1000,
  });

  const content = resp?.choices?.[0]?.message?.content || "";
  console.log("content :", content);
  if (process.env.NODE_ENV !== "production") {
    console.debug("Groq raw content:", content);
  }

  if (!content || content.trim() === "") {
    throw new Error("Groq returned empty content");
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error("JSON parsing failed:", err);
    throw new Error("Invalid JSON returned from Groq");
  }

  // Normalize tips to objects { title, detail }
  const tipsNormalized = [];
  if (Array.isArray(parsed.tips)) {
    for (const t of parsed.tips.slice(0, 3)) {
      if (!t) continue;
      if (typeof t === "string") {
        // Try to split a title and detail by a dash/colon, otherwise treat full string as detail
        const parts = t.split(/[-:–—]/);
        const maybeTitle = parts[0].trim();
        const maybeDetail = parts.slice(1).join("-").trim();
        if (maybeDetail) {
          tipsNormalized.push({
            title: maybeTitle.slice(0, 120),
            detail: maybeDetail.slice(0, 4000),
          });
        } else {
          // no clear separator — use first short phrase as title and rest as detail heuristically
          const words = t.split(" ");
          const title = words.slice(0, 5).join(" ");
          const detail = words.slice(5).join(" ");
          tipsNormalized.push({
            title: String(title).slice(0, 120),
            detail: String(detail || t).slice(0, 4000),
          });
        }
      } else if (typeof t === "object") {
        tipsNormalized.push({
          title: String(t.title || "")
            .trim()
            .slice(0, 120),
          detail: String(t.detail || "")
            .trim()
            .slice(0, 4000),
        });
      }
    }
  }

  return {
    summary: String(parsed.summary || "").trim(),
    tips: tipsNormalized,
    _raw: content,
  };
}

function getDaysUntilExpiry(date) {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

async function processPlanAlertEmails(user, snapshot) {
  const daysLeft = getDaysUntilExpiry(snapshot.planEndDate);

  const alerts = user.aiTipAlerts || {};
  const sameCycle =
    alerts.cyclePlanEndDate &&
    snapshot.planEndDate &&
    new Date(alerts.cyclePlanEndDate).getTime() ===
      new Date(snapshot.planEndDate).getTime();

  if (!sameCycle) {
    user.aiTipAlerts = {
      cyclePlanEndDate: snapshot.planEndDate,
      lowRequestsOneSent: false,
      expiry5DaysSent: false,
      expiry1DaySent: false,
    };
  }

  const currentAlerts = user.aiTipAlerts || {};

  if (snapshot.remainingTips === 1 && !currentAlerts.lowRequestsOneSent) {
    await sendAITipsLowRemainingEmail(user.email, user.name, 1);
    currentAlerts.lowRequestsOneSent = true;
  }

  if (daysLeft === 5 && !currentAlerts.expiry5DaysSent) {
    await sendSubscriptionExpiryReminderEmail(
      user.email,
      user.name,
      5,
      snapshot.planName,
      snapshot.planEndDate,
    );
    currentAlerts.expiry5DaysSent = true;
  }

  if (daysLeft === 1 && !currentAlerts.expiry1DaySent) {
    await sendSubscriptionExpiryReminderEmail(
      user.email,
      user.name,
      1,
      snapshot.planName,
      snapshot.planEndDate,
    );
    currentAlerts.expiry1DaySent = true;
  }

  user.aiTipAlerts = currentAlerts;
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    // parse optional debug flag from request body or querystring
    let debug = false;
    try {
      const body = await request.json().catch(() => ({}));
      if (body && body.debug) debug = true;
    } catch (e) {}
    try {
      const url = new URL(request.url);
      if (url.searchParams.get("debug") === "1") debug = true;
    } catch (e) {}

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const snapshotBefore = getSubscriptionSnapshot(user);

    if (!snapshotBefore.isActive) {
      return NextResponse.json(
        {
          error: "Active paid subscription required for AI Tips",
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (!snapshotBefore.canUseAITips) {
      return NextResponse.json(
        {
          error: "Monthly AI tips limit reached",
          code: "LIMIT_REACHED",
          remainingTips: 0,
        },
        { status: 429 },
      );
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthName = now.toLocaleString("en-US", { month: "long" });

    const monthDoc = await Month.findOne({ userId, year, month });

    const habits = await Habit.find({
      userId,
      monthId: monthDoc?._id,
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const logs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      completed: true,
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const totalPossible = habits.length * daysInMonth;
    const completionRate =
      totalPossible > 0 ? Math.round((logs.length / totalPossible) * 100) : 0;

    const activeDaysSet = new Set(
      logs.map((log) => new Date(log.date).toISOString().slice(0, 10)),
    );

    const categoryCounts = habits.reduce((acc, habit) => {
      const key = habit.category || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];

    const contextText = buildHabitContext({
      monthName,
      year,
      habits,
      logs,
      daysInMonth,
      monthDoc,
    });

    let tipObj;
    try {
      tipObj = await generateGroqSummary(contextText);
    } catch (err) {
      console.error("Groq generation failed:", err);
      return NextResponse.json(
        { error: "Failed to generate AI summary" },
        { status: 502 },
      );
    }

    const isEmptyResult =
      !tipObj ||
      (typeof tipObj.summary === "string" &&
        tipObj.summary.trim().length < 10 &&
        (!Array.isArray(tipObj.tips) || tipObj.tips.length === 0));

    if (isEmptyResult) {
      console.warn(
        "AI tips generation produced empty result, retrying with strict prompt...",
      );
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const retry = await generateGroqSummary(contextText, {
            strict: true,
            temperature: 0.0,
          });
          if (
            retry &&
            ((retry.summary && retry.summary.trim().length >= 10) ||
              (Array.isArray(retry.tips) && retry.tips.length > 0))
          ) {
            tipObj = retry;
            break;
          }
        } catch (e) {
          console.error("Retry generation failed:", e);
        }
      }
    }

    const finalEmpty =
      !tipObj ||
      (typeof tipObj.summary === "string" &&
        tipObj.summary.trim().length < 10 &&
        (!Array.isArray(tipObj.tips) || tipObj.tips.length === 0));

    if (finalEmpty) {
      console.error(
        "AI tips generation returned empty content after retries. Raw output:",
        tipObj?._raw || "(no raw)",
      );
      const payload = {
        error: "AI generation returned no content, please try again later",
      };
      if (debug || process.env.NODE_ENV !== "production") {
        payload.debug = { raw: tipObj?._raw || null };
      }
      return NextResponse.json(payload, { status: 502 });
    }

    // increment usage only after successful non-empty generation
    incrementAITipsUsage(user, now);
    const snapshotAfterUsage = getSubscriptionSnapshot(user, now);
    await processPlanAlertEmails(user, snapshotAfterUsage);
    await user.save();

    const responsePayload = {
      success: true,
      summary: tipObj.summary || "",
      tips: tipObj.tips || [],
      remainingTips: snapshotAfterUsage.remainingTips,
      usedThisMonth: snapshotAfterUsage.usedThisMonth,
      maxMonthlyTips: snapshotAfterUsage.maxMonthlyTips,
      planName: snapshotBefore.planName,
    };
    if (debug || process.env.NODE_ENV !== "production") {
      responsePayload.debug = { raw: tipObj._raw || null };
    }
    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error generating AI tips:", error);
    return NextResponse.json(
      { error: "Failed to generate AI tips" },
      { status: 500 },
    );
  }
}
