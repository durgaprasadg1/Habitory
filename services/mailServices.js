import nodemailer from "nodemailer";

// Create Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
      from: `"Habitory" <${process.env.EMAIL_USER}>`,
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