import nodemailer from "nodemailer";

let cachedTransporter = null;

function toBoolean(value) {
  return String(value).toLowerCase() === "true";
}

export function getContactTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.GOOGLE_SMTP_HOST;
  const port = Number(process.env.GOOGLE_SMTP_PORT || 465);
  const secure = toBoolean(process.env.GOOGLE_SMTP_SECURE ?? "true");
  const user = process.env.GOOGLE_SMTP_USER;
  const pass = process.env.GOOGLE_SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Missing Google SMTP environment variables. Check your .env.local file.",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}
