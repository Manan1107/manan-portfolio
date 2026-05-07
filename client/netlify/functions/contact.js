import nodemailer from "nodemailer";

const DEFAULT_RECIPIENT = "mananjaviya11@gmail.com";

const json = (body, statusCode = 200) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }

  const { name = "", email = "", subject = "", message = "" } = JSON.parse(event.body || "{}");
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim();
  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return json({ success: false, message: "Name, email and message are required." }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return json({ success: false, message: "Please enter a valid email address." }, 400);
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return json({ success: false, message: "Email is not configured." }, 500);
  }

  const recipient = String(process.env.EMAIL_TO || DEFAULT_RECIPIENT).trim();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `"Manan Portfolio" <${process.env.GMAIL_USER}>`,
      to: recipient,
      replyTo: cleanEmail,
      subject: `New portfolio contact from ${cleanName} - ${cleanSubject || "No subject"}`,
      text: [
        "New Contact Request",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        cleanSubject ? `Subject: ${cleanSubject}` : "",
        `Message: ${cleanMessage}`,
      ].filter(Boolean).join("\n"),
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
        ${cleanSubject ? `<p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(cleanMessage).replace(/\n/g, "<br />")}</p>
      `,
    });

    return json({ success: true, message: "Email sent." });
  } catch (error) {
    console.error("Gmail SMTP failed:", error);
    const detail = String(error?.message || "");
    const code = String(error?.code || "");

    if (code === "EAUTH" || /invalid login|username and password/i.test(detail)) {
      return json({
        success: false,
        message: "Gmail login failed. Check GMAIL_USER and GMAIL_APP_PASSWORD in Netlify.",
      }, 500);
    }

    if (code === "ETIMEDOUT" || /timeout/i.test(detail)) {
      return json({
        success: false,
        message: "Gmail SMTP timed out. Try again or check Netlify function logs.",
      }, 500);
    }

    return json({
      success: false,
      message: "Email could not be sent. Check Netlify function logs.",
    }, 500);
  }
};
