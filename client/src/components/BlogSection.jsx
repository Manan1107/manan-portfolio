import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data } = await axios.get("/content/blogs.json");
    setPosts(data.map((item, index) => ({ ...item, _id: `blog-${index}` })));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="section glass">
      <h2>Blog</h2>
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
