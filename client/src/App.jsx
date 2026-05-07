import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import axios from "axios";
import ContactSection from "./components/ContactSection";

const resumeUrl = "/Manan_Javiya_Resume.pdf";
const staticContent = {
  blogs: "/content/blogs.json",
  notes: "/content/notes.json",
};

async function fetchStaticItems(type) {
  const { data } = await axios.get(staticContent[type]);
  return data.map((item, index) => ({
    _id: `${type}-${index}`,
    title: item.title,
    content: item.content,
    text: item.content,
    createdAt: item.date,
    noteDate: item.date,
  }));
}

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

  const fetchPosts = async () => {
    setPosts(await fetchStaticItems("blogs"));
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <section className="panel blog-page">
      <p className="kicker">Blog</p>
      <h2>Writing</h2>
      <div className="list">
        {posts.map((post) => (
          <Link key={post._id} to={`/blog/${encodeURIComponent(post._id)}`} className="blog-card click-card">
            <p className="meta">{new Date(post.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            <h3>{post.title}</h3>
            <p className="clamp-2">{post.content}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BlogDetailPage() {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => setPosts(await fetchStaticItems("blogs")))();
  }, []);

  const post = useMemo(
    () => posts.find((p) => encodeURIComponent(p._id) === postId),
    [posts, postId]
  );

  if (!post) {
    return (
      <section className="panel">
        <p className="kicker">Blog</p>
        <h2>Post not found</h2>
        <p className="meta">This post may have been removed or the link is wrong.</p>
        <div className="quick-links">
          <Link to="/blog">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <p className="kicker">Blog</p>
      <h2>{post.title}</h2>
      <p className="meta">{new Date(post.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{post.content}</p>
      <div className="quick-links" style={{ marginTop: 18 }}>
        <Link to="/blog">Back to Blog</Link>
      </div>
    </section>
  );
}

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const fetchNotes = async () => {
    const data = await fetchStaticItems("notes");
    setNotes(data);
    if (!activeId && data.length) setActiveId(data[0]._id);
  };

  useEffect(() => { fetchNotes(); }, []);

  const active = notes.find((n) => n._id === activeId);

  return (
    <section className="panel">
      <p className="kicker">Diary / Notes</p>
      <h2>Notes app style workspace.</h2>
      <div className="notes-layout">
        <aside className="notes-sidebar">
          {notes.map((note) => (
            <Link
              key={note._id}
              to={`/notes/${encodeURIComponent(note._id)}`}
              className={`note-item ${activeId === note._id ? "active" : ""}`}
              onClick={() => setActiveId(note._id)}
            >
              <strong>{note.title}</strong>
              <span>{new Date(note.noteDate || note.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
              <span className="clamp-2" style={{ color: "#c7ced8", fontSize: 12, lineHeight: 1.4 }}>
                {note.text}
              </span>
            </Link>
          ))}
        </aside>
        <div className="notes-main">
          {active ? (
            <article className="card">
              <p className="meta">{new Date(active.noteDate || active.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
            </article>
          ) : (
            <p>No notes yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function NoteDetailPage() {
  const { noteId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => setNotes(await fetchStaticItems("notes")))();
  }, []);

  const note = useMemo(
    () => notes.find((n) => encodeURIComponent(n._id) === noteId),
    [notes, noteId]
  );

  if (!note) {
    return (
      <section className="panel">
        <p className="kicker">Notes</p>
        <h2>Note not found</h2>
        <p className="meta">This note may have been removed or the link is wrong.</p>
        <div className="quick-links">
          <Link to="/notes">Back to Notes</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <p className="kicker">Notes</p>
      <h2>{note.title}</h2>
      <p className="meta">{new Date(note.noteDate || note.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{note.text}</p>
      <div className="quick-links" style={{ marginTop: 18 }}>
        <Link to="/notes">Back to Notes</Link>
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
          <Route path="/blog/:postId" element={<BlogDetailPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<NoteDetailPage />} />
          <Route path="/contact" element={<section className="panel"><ContactSection /></section>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
