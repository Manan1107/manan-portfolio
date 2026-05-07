import { useState } from "react";
import axios from "axios";

export default function ContactSection() {
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setStatus("Sending...");
    try {
      await axios.post("/.netlify/functions/contact", form, { timeout: 30000 });
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      try {
        await axios.post(
          "https://formsubmit.co/ajax/mananjaviya11@gmail.com",
          {
            name: form.name,
            email: form.email,
            subject: form.subject || "Portfolio contact",
            message: form.message,
            _subject: `Portfolio contact: ${form.subject || "No subject"}`,
            _captcha: "false",
          },
          {
            timeout: 30000,
            headers: { Accept: "application/json" },
          }
        );
        setStatus("Message sent successfully.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } catch (fallbackError) {
        setStatus(
          fallbackError.code === "ECONNABORTED"
            ? "Email service did not respond. Please try again."
            : fallbackError.response?.data?.message || "Failed to send message. Please use the Email me button."
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const directEmail = "mananjaviya11@gmail.com";
  const mailtoHref = `mailto:${directEmail}`;

  return (
    <div className="contact-box">
      <p className="contact-meta">Location: Ahmedabad, India</p>
      <form className="form" onSubmit={onSubmit}>
        <input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          required
        />
        <textarea
          placeholder="Message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          required
        />
        <div className="cta-row" style={{ margin: 0 }}>
          <button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send message"}
          </button>
          <a className="btn btn-ghost" href={mailtoHref}>
            Email me
          </a>
        </div>
        <p>{status}</p>
      </form>
    </div>
  );
}
