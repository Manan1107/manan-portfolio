import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogSection({ apiBase }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchPosts = async () => {
    const { data } = await axios.get(`${apiBase}/blogs`);
    setPosts(data);
  };

  const addPost = async (e) => {
    e.preventDefault();
    await axios.post(`${apiBase}/blogs`, form);
    setForm({ title: "", content: "" });
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="section glass">
      <h2>Blog</h2>
      <form className="form" onSubmit={addPost}>
        <input
          placeholder="Post title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
        <textarea
          placeholder="Write your blog content..."
          rows={4}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          required
        />
        <button type="submit">Publish</button>
      </form>
      <div className="cards">
        {posts.map((post) => (
          <article key={post._id} className="card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
