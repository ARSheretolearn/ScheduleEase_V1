import nodemailer from "nodemailer";

let transporter = null;
const initTransporter = () => {
  if (transporter) return transporter;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const t = initTransporter();
  if (!t) {
    console.log("EMAIL (logged, transporter not configured):");
    console.log({ to, subject, text, html });
    return;
  }
  try {
    const info = await t.sendMail({ from: process.env.EMAIL_USER, to, subject, text, html });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};
