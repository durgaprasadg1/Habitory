import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);
const useSecureTransport = smtpPort === 465;

// Create Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: useSecureTransport,
  service: process.env.SMTP_SERVICE || "gmail",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// Verify transporter once (optional in production)
transporter.verify((error) => {
  if (error) {
    console.error("Transporter Error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

// Generic Email Sender
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Habitory" <${process.env.MAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.log("Email sending failed:", error);
    return false;
  }
};

// Signup Email
export const sendSignupEmail = async (userEmail, name) => {
  const subject = "Welcome to Habitory — Let’s Get Started";

  const text = `Hi ${name},

Welcome to Habitory!

Your account has been successfully created, and you’re now ready to begin building better habits with clarity and consistency.

At Habitory, we believe small daily actions create long-term transformation. Start by setting your first habit and tracking your progress.

If you ever need assistance, our team is here to help.

Warm regards,  
The Habitory Team
`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
        
        <h2 style="color: #111827; margin-bottom: 10px;">
          Welcome to Habitory, ${name}
        </h2>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Your account has been successfully created.
        </p>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Habitory is designed to help you build meaningful habits through structure, focus, and consistency.
        </p>

        <div style="margin: 25px 0;">
          <a href="https://yourdomain.com/dashboard"
             style="background-color: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">
            Go to Dashboard
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions or need support, simply reply to this email — we’re happy to help.
        </p>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} Habitory. All rights reserved.
        </p>

      </div>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

export const sendSigninEmail = async (userEmail, name) => {
  const subject = "Notice of Recent Sign-In to Your Habitory Account";

  const text = `Hi ${name},

We’re writing to inform you that your Habitory account was recently accessed.

If this was you, no further action is required.

If you did not sign in, we recommend resetting your password at the earliest and reviewing your account activity.

If you need assistance, our support team is available to help.

Sincerely,  
Habitory Support Team
`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
        
        <h2 style="color: #111827; margin-bottom: 15px;">
          Recent Sign-In Notice
        </h2>

        <p style="color: #374151; font-size: 15px;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          We’re writing to inform you that your Habitory account was recently accessed.
        </p>

        <p style="color: #374151; font-size: 14px;">
          If this was you, no further action is required.
        </p>

        <p style="color: #374151; font-size: 14px;">
          If you did not sign in, we recommend resetting your password and securing your account.
        </p>

        

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} Habitory. All rights reserved.
        </p>

      </div>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

export const sendSubscriptionActivatedEmail = async (
  userEmail,
  name,
  planName,
  planEndDate,
) => {
  const subject = `Your ${planName} subscription is now active`;
  const endDateText = new Date(planEndDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const text = `Hi ${name},

Your ${planName} subscription has been activated successfully.

You can now use your monthly AI Tips quota from the dashboard.
Subscription valid till: ${endDateText}

Thanks,
Habitory Team`;

  const html = `
    <div style="font-family: Segoe UI, Arial, sans-serif; padding: 24px; background: #f8f5f2; color: #1c1917;">
      <div style="max-width: 600px; margin: auto; background: #fff; border: 1px solid #e7e5e4; border-radius: 10px; padding: 24px;">
        <h2 style="margin-top: 0; color: #c08457;">Subscription Activated</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your <strong>${planName}</strong> subscription is now active.</p>
        <p>You can use AI Tips from your dashboard immediately.</p>
        <p><strong>Valid till:</strong> ${endDateText}</p>
      </div>
    </div>
  `;

  return sendEmail(userEmail, subject, text, html);
};

export const sendAITipsLowRemainingEmail = async (
  userEmail,
  name,
  remainingTips,
) => {
  const subject = "Only 1 AI Tip request left this month";

  const text = `Hi ${name},

You have ${remainingTips} AI Tip request left for this month.

Use it to generate your monthly summary and personalized tips.

Habitory Team`;

  const html = `
    <div style="font-family: Segoe UI, Arial, sans-serif; padding: 24px; background: #f8f5f2; color: #1c1917;">
      <div style="max-width: 600px; margin: auto; background: #fff; border: 1px solid #e7e5e4; border-radius: 10px; padding: 24px;">
        <h2 style="margin-top: 0; color: #c08457;">AI Tip Usage Alert</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>You now have <strong>${remainingTips}</strong> AI Tip request left this month.</p>
      </div>
    </div>
  `;

  return sendEmail(userEmail, subject, text, html);
};

export const sendSubscriptionExpiryReminderEmail = async (
  userEmail,
  name,
  daysLeft,
  planName,
  endDate,
) => {
  const subject = `Your ${planName} subscription expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
  const endDateText = new Date(endDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const text = `Hi ${name},

Your ${planName} subscription will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.
Expiry date: ${endDateText}

Renew soon to keep using AI Tips.

Habitory Team`;

  const html = `
    <div style="font-family: Segoe UI, Arial, sans-serif; padding: 24px; background: #f8f5f2; color: #1c1917;">
      <div style="max-width: 600px; margin: auto; background: #fff; border: 1px solid #e7e5e4; border-radius: 10px; padding: 24px;">
        <h2 style="margin-top: 0; color: #c08457;">Subscription Expiry Reminder</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your <strong>${planName}</strong> subscription expires in <strong>${daysLeft}</strong> day${daysLeft > 1 ? "s" : ""}.</p>
        <p><strong>Expiry date:</strong> ${endDateText}</p>
      </div>
    </div>
  `;

  return sendEmail(userEmail, subject, text, html);
};
