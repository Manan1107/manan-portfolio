import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required.",
    });
  }

  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER === "yourgmail@gmail.com" ||
    process.env.EMAIL_PASS === "your_gmail_app_password"
  ) {
    return res.status(500).json({
      success: false,
      message: "Email is not configured. Add EMAIL_USER and EMAIL_PASS on the server.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_ALLOW_SELF_SIGNED_TLS !== "true",
      },
    });

    await transporter.sendMail({
      from: `"Manan Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New portfolio contact from ${name} - ${subject || "No subject"}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Email sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
