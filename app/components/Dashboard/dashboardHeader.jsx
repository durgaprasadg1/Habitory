import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShineButton from "../../../components/ui/shine-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardHeader({
  month,
  year,
  onPrev,
  onNext,
  subscription,
  onTipsUpdated,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [tips, setTips] = useState([]);
  const [usage, setUsage] = useState({
    remainingTips: subscription?.remainingTips || 0,
    usedThisMonth: subscription?.usedThisMonth || 0,
    maxMonthlyTips: subscription?.maxMonthlyTips || 0,
    planName: subscription?.planName || "",
  });

  const isSubscribed = Boolean(subscription?.isActive);
  const usedAllTips = usage.usedThisMonth >= usage.maxMonthlyTips;

  useEffect(() => {
    setUsage({
      remainingTips: subscription?.remainingTips || 0,
      usedThisMonth: subscription?.usedThisMonth || 0,
      maxMonthlyTips: subscription?.maxMonthlyTips || 0,
      planName: subscription?.planName || "",
    });
  }, [subscription]);

  const handleAISummaryButton = () => {
    router.push("/plans");
  };

  const handleGenerateTip = async () => {
    try {
      setLoading(true);
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");
      const res = await fetch("/api/ai-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debug: isLocal }),
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        console.log("AI Tips endpoint returned non-JSON response:", text);
        data = { summary: text };
      }

      if (!res.ok) {
        toast.error(data?.error || "Failed to generate AI Tip");
        console.error("AI Tips error response:", data);
        return;
      }

      const summaryText =
        data && typeof data.summary === "string"
          ? data.summary
          : String(data.summary || "");
      const tipsArray = Array.isArray(data.tips) ? data.tips : [];

      setSummary(summaryText);
      setTips(tipsArray);
      setUsage({
        remainingTips: data.remainingTips,
        usedThisMonth: data.usedThisMonth,
        maxMonthlyTips: data.maxMonthlyTips,
        planName: data.planName,
      });

      if (typeof onTipsUpdated === "function") {
        onTipsUpdated(true);
      }

      toast.success("AI Tip generated for this month");
      console.log("Usage:", usage);
      console.log("data:", data);
    } catch (err) {
      console.error("Failed to generate AI Tip:", err);
      toast.error("Failed to generate AI Tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center  ">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="text-[#1C1917] hover:bg-[#E7E5E4]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center min-w-40">
          <h2 className="text-xl font-bold text-[#C08457]">
            {month} {"  "}
            {year}
          </h2>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="text-[#1C1917] hover:bg-[#E7E5E4]"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* <div>
        <Dialog>
          <DialogTrigger asChild>
            <ShineButton>
              <Sparkles size={16} />
              {!isSubscribed
                ? "Get AI Tips"
                : usedAllTips
                  ? "Quota for this month is Over"
                  : "Get AI Tip for this month"}
            </ShineButton>
          </DialogTrigger>
          <DialogContent
            className="
    sm:max-w-sm
    bg-[#F8F5F2]
    border border-[#C08457]/30
    shadow-2xl
    rounded-2xl
  "
          >
            {!isSubscribed && (
              <>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl font-semibold text-[#1C1917]">
                    Upgrade to Premium ✨
                  </DialogTitle>

                  <DialogDescription className="text-sm text-[#78716C]">
                    AI Tips are available only after successful subscription
                    activation.
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-[#E7E5E4] rounded-xl p-4 mt-4 text-sm text-[#1C1917] space-y-2">
                  <p>AI Monthly Summary</p>
                  <p>Personalized Suggestions</p>
                  <p>Advanced Progress Analytics</p>
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="border-[#C08457]/40 text-[#1C1917] hover:bg-[#E7E5E4]"
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type="button"
                    className="bg-[#C08457] hover:bg-[#f0b15a] text-white rounded-xl"
                    onClick={handleAISummaryButton}
                  >
                    See Plans
                  </Button>
                </DialogFooter>
              </>
            )}

            {isSubscribed && (
              <>
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-xl font-semibold text-[#1C1917]">
                    AI Tips for {month} {year}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#78716C]">
                    Plan: {usage.planName || subscription?.planName} | Used:{" "}
                    {usage.usedThisMonth} / {usage.maxMonthlyTips} | Remaining:{" "}
                    {usage.remainingTips}
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-[#E7E5E4] rounded-xl p-4 mt-4 text-sm text-[#1C1917] max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-3 bg-[#EDEBE9] rounded w-3/4" />
                      <div className="h-3 bg-[#EDEBE9] rounded w-full" />
                      <div className="h-3 bg-[#EDEBE9] rounded w-5/6" />
                      <div className="h-3 bg-[#EDEBE9] rounded w-2/3" />
                    </div>
                  ) : summary ? (
                    <div>
                      <div className="mb-3">{summary}</div>
                      {tips && tips.length > 0 && (
                        <div className="space-y-3">
                          {tips.map((t, i) => {
                            const title =
                              typeof t === "string" ? t : t.title || "";
                            const detail =
                              typeof t === "string" ? "" : t.detail || "";
                            return (
                              <div key={i} className="text-sm">
                                <div className="font-medium">
                                  {i + 1}. {title}
                                </div>
                                {detail && (
                                  <div className="text-xs text-[#6B6B6B] mt-1">
                                    {detail}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-[#A8A29E]">
                      No summary yet. Click Generate to create one.
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="border-[#C08457]/40 text-[#1C1917] hover:bg-[#E7E5E4]"
                    >
                      Close
                    </Button>
                  </DialogClose>

                  <Button
                    type="button"
                    disabled={loading || usage.remainingTips <= 0}
                    className="bg-[#C08457] hover:bg-[#f0b15a] text-white rounded-xl"
                    onClick={handleGenerateTip}
                  >
                    {loading
                      ? "Generating..."
                      : usage.remainingTips > 0
                        ? "Generate AI Tip"
                        : "Monthly Limit Reached"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div> */}
    </div>
  );
}
