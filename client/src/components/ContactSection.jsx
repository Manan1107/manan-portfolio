import { useState } from "react";
import axios from "axios";

export default function ContactSection({ apiBase }) {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post(`${apiBase}/contact`, form, { timeout: 30000 });
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus(
        error.code === "ECONNABORTED"
          ? "Server did not respond. Open the Render backend once, then try again."
          : error.response?.data?.message || "Failed to send message."
      );
    }
  };

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
        <button type="submit">Send message</button>
        <p>{status}</p>
      </form>
    </div>
  );
}
