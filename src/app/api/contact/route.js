import { NextResponse } from "next/server";
import { getMailboxForEnquiryType } from "@/lib/contact-config";
import { getContactTransporter } from "@/lib/contact-mailer";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildTextEmail({
  name,
  email,
  phone,
  enquiryType,
  message,
  submittedAt,
}) {
  return [
    "New contact form enquiry",
    "",
    `Type of Enquiry: ${enquiryType}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Submitted At: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

function buildHtmlEmail({
  name,
  email,
  phone,
  enquiryType,
  message,
  submittedAt,
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #29541f; line-height: 1.6;">
      <h2 style="margin: 0 0 20px;">New contact form enquiry</h2>

      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; width: 180px;">Type of Enquiry</td>
          <td style="padding: 8px 12px;">${escapeHtml(enquiryType)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Name</td>
          <td style="padding: 8px 12px;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Email</td>
          <td style="padding: 8px 12px;">
            <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Phone</td>
          <td style="padding: 8px 12px;">${escapeHtml(phone || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Submitted At</td>
          <td style="padding: 8px 12px;">${escapeHtml(submittedAt)}</td>
        </tr>
      </table>

      <div style="margin-top: 24px;">
        <div style="font-weight: bold; margin-bottom: 8px;">Message</div>
        <div style="padding: 16px; background: #f8f6ef; border: 1px solid rgba(41, 84, 31, 0.16); border-radius: 12px; white-space: pre-wrap;">
          ${escapeHtml(message)}
        </div>
      </div>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body?.name?.trim() || "";
    const email = body?.email?.trim() || "";
    const phone = body?.phone?.trim() || "";
    const enquiryType = body?.enquiryType?.trim() || "";
    const message = body?.message?.trim() || "";
    const companyWebsite = body?.companyWebsite?.trim() || "";

    if (companyWebsite) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || !email || !enquiryType || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please provide a little more detail in your message." },
        { status: 400 },
      );
    }

    const to = getMailboxForEnquiryType(enquiryType);
    const transporter = getContactTransporter();

    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const fromName = process.env.CONTACT_FROM_NAME || "Website Contact Form";

    if (!fromEmail) {
      throw new Error("Missing CONTACT_FROM_EMAIL in environment variables.");
    }

    const submittedAt = new Date().toISOString();

    const subject = `[BIG Website] ${enquiryType} — ${name}`;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      replyTo: email,
      subject,
      text: buildTextEmail({
        name,
        email,
        phone,
        enquiryType,
        message,
        submittedAt,
      }),
      html: buildHtmlEmail({
        name,
        email,
        phone,
        enquiryType,
        message,
        submittedAt,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending your enquiry." },
      { status: 500 },
    );
  }
}
