import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import ContactSection from "./components/ContactSection";

const resumeUrl = "/Manan_Javiya_Resume.pdf";
const apiBase = import.meta.env.VITE_API_BASE_URL || "https://manan-portfolio-en6k.onrender.com/api";

function HomePage() {
  return (
    <section className="panel">
      <p className="kicker">Portfolio</p>
      <h1>Manan Javiya</h1>
      <p className="lead">
        Computer Engineer from Ahmedabad building reliable full-stack and real-time systems.
      </p>
      <div className="chips">
        <span>MERN</span>
        <span>Machine Learning</span>
        <span>Real-time Apps</span>
      </div>
      <div className="quick-links">
        <a href={resumeUrl} download="Manan_Javiya_Resume.pdf">Download Resume</a>
        <a href="https://github.com/Manan1107" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/manan-javiya/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </section>
  );
}

function ProjectsPage() {
  const items = [
    ["Cognitive Pattern Decoder", "ML + Dev Tools", "Pattern detection and coding insights."],
    ["Real-Time Chat Application", "MERN + Socket.io", "Low-latency chat with scalable API design."],
    ["ExpoEase", ".NET MVC", "Role-based exhibition booking and event workflows."],
  ];
  return (
    <section className="panel">
      <p className="kicker">Projects</p>
      <h2>Systems I have shipped.</h2>
      <div className="list">
        {items.map((item) => (
          <article className="card" key={item[0]}>
            <h3>{item[0]}</h3>
            <p>{item[1]}</p>
            <p>{item[2]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [status, setStatus] = useState("");

  const fetchPosts = async () => {
    const { data } = await axios.get(`${apiBase}/blogs`);
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Publishing...");
    try {
      await axios.post(`${apiBase}/blogs`, form);
      setForm({ title: "", content: "" });
      setStatus("Published");
      fetchPosts();
    } catch {
      setStatus("Failed to publish");
    }
  };

  return (
    <section className="panel blog-page">
      <p className="kicker">Blog</p>
      <h2>Writing</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Blog title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <textarea rows={5} placeholder="Blog content" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required />
        <button type="submit">Publish Post</button>
        <p>{status}</p>
      </form>
      <div className="list">
        {posts.map((post) => (
          <article className="blog-card" key={post._id}>
            <p className="meta">{new Date(post.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({ title: "", text: "", noteDate: "" });
  const [status, setStatus] = useState("");

  const fetchNotes = async () => {
    const { data } = await axios.get(`${apiBase}/notes`);
    setNotes(data);
    if (!activeId && data.length) setActiveId(data[0]._id);
  };

  useEffect(() => { fetchNotes(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await axios.post(`${apiBase}/notes`, form);
      setForm({ title: "", text: "", noteDate: "" });
      setStatus("Saved");
      fetchNotes();
    } catch {
      setStatus("Failed to save");
    }
  };

  const removeNote = async (id) => {
    try {
      await axios.delete(`${apiBase}/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (activeId === id) setActiveId(null);
    } catch {
      setStatus("Failed to delete note");
    }
  };

  const active = notes.find((n) => n._id === activeId);

  return (
    <section className="panel">
      <p className="kicker">Diary / Notes</p>
      <h2>Notes app style workspace.</h2>
      <div className="notes-layout">
        <aside className="notes-sidebar">
          {notes.map((note) => (
            <button type="button" key={note._id} className={`note-item ${activeId === note._id ? "active" : ""}`} onClick={() => setActiveId(note._id)}>
              <strong>{note.title}</strong>
              <span>{new Date(note.noteDate || note.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
            </button>
          ))}
        </aside>
        <div className="notes-main">
          {active ? (
            <article className="card">
              <p className="meta">{new Date(active.noteDate || active.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
              <button type="button" className="danger-btn" onClick={() => removeNote(active._id)}>
                Delete Completed Note
              </button>
            </article>
          ) : (
            <p>No notes yet.</p>
          )}
          <form className="form" onSubmit={submit}>
            <input placeholder="Note title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            <input type="date" value={form.noteDate} onChange={(e) => setForm((p) => ({ ...p, noteDate: e.target.value }))} required />
            <textarea rows={4} placeholder="Write note..." value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} required />
            <button type="submit">Save Note</button>
            <p>{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "Manan Javiya | Portfolio";
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Manan Javiya</h3>
        <p>Computer Engineer</p>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/projects">Work</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="sidebar-links">
          <a href={resumeUrl} download="Manan_Javiya_Resume.pdf">Resume</a>
          <a href="https://github.com/Manan1107" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/manan-javiya/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/contact" element={<section className="panel"><ContactSection apiBase={apiBase} /></section>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
