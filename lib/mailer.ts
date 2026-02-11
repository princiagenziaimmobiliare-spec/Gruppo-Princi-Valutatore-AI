import nodemailer from "nodemailer";

export async function sendEmails(payload: {
  userEmail: string;
  userSubject: string;
  userText: string;
  agencySubject: string;
  agencyText: string;
}) {
  const host = process.env.SMTP_HOST;
  if (!host) return;

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });

  const from = process.env.SMTP_FROM || "no-reply@gruppoprinci.it";
  const agency = process.env.AGENCY_LEADS_EMAIL;

  await transporter.sendMail({ from, to: payload.userEmail, subject: payload.userSubject, text: payload.userText });
  if (agency) {
    await transporter.sendMail({ from, to: agency, subject: payload.agencySubject, text: payload.agencyText });
  }
}
