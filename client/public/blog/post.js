import { apiGet, esc, formatDate } from "/public-pages.js";

const postEl = document.getElementById("post");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");

function toParagraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${esc(part)}</p>`)
    .join("");
}

function getId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id") || "";
}

async function load() {
  try {
    const id = getId();
    const posts = await apiGet("blogs");
    const post = posts.find((p) => p._id === id);

    if (!post) {
      titleEl.textContent = "Post not found";
      subtitleEl.textContent = "This link may be wrong or the post was removed.";
      postEl.innerHTML = `
        <div class="meta">Blog</div>
        <h2>Missing post</h2>
        <p>Go back to the <a href="/blog/index.html">blog list</a>.</p>
      `;
      return;
    }

    document.title = `${post.title} | Manan Javiya`;
    titleEl.textContent = post.title;
    subtitleEl.textContent = formatDate(post.createdAt);

    postEl.innerHTML = `
      <div class="meta">${formatDate(post.createdAt)}</div>
      <h2>${esc(post.title)}</h2>
      <div class="content">${toParagraphs(post.content)}</div>
      <a class="back-link" href="/blog/index.html">← Back to Blog</a>
    `;
  } catch {
    titleEl.textContent = "Could not load";
    subtitleEl.textContent = "Please try again.";
    postEl.innerHTML = `<p class="status">Could not load this post.</p>`;
  }
}

load();

