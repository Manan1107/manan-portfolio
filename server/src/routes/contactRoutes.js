import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const requiredEmailEnvMissing = () =>
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  process.env.EMAIL_USER === "yourgmail@gmail.com" ||
  process.env.EMAIL_PASS === "your_gmail_app_password";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

const sendWithWeb3Forms = async ({ name, email, phone, subject, message }) => {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      from_name: "Manan Portfolio",
      subject: `New portfolio contact from ${name} - ${subject || "No subject"}`,
      name,
      email,
      phone,
      message,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Web3Forms could not send the message.");
  }
};

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    emailConfigured: Boolean(process.env.WEB3FORMS_ACCESS_KEY) || !requiredEmailEnvMissing(),
    web3FormsConfigured: Boolean(process.env.WEB3FORMS_ACCESS_KEY),
    smtpConfigured: !requiredEmailEnvMissing(),
    recipientConfigured: Boolean(process.env.EMAIL_TO || process.env.EMAIL_USER),
  });
});

router.post("/", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  if (!process.env.WEB3FORMS_ACCESS_KEY && requiredEmailEnvMissing()) {
    return res.status(500).json({
      success: false,
      message: "Email is not configured on the server. Add WEB3FORMS_ACCESS_KEY in Render.",
    });
  }

  try {
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      await sendWithWeb3Forms({ name, email, phone, subject, message });
      return res.json({ success: true, message: "Email sent." });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Manan Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New portfolio contact from ${name} - ${subject || "No subject"}`,
      text: [
        "New Contact Request",
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : "",
        phone ? `Phone: ${phone}` : "",
        `Message: ${message}`,
      ].filter(Boolean).join("\n"),
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    res.json({ success: true, message: "Email sent." });
  } catch (error) {
    console.error("Contact email failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
