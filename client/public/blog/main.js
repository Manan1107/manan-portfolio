import { apiGet, esc, formatDate } from "/public-pages.js";

const list = document.getElementById("list");

async function load() {
  try {
    const posts = await apiGet("blogs");
    if (!posts.length) {
      list.innerHTML = '<p class="status">No blog posts yet.</p>';
      return;
    }

    list.innerHTML = posts
      .map(
        (post) => `
          <article class="item">
            <div class="meta">${formatDate(post.createdAt)}</div>
            <h2>${esc(post.title)}</h2>
            <p>${esc(post.content)}</p>
          </article>
        `
      )
      .join("");
  } catch {
    list.innerHTML = '<p class="status">Could not load blog posts. Make sure the backend is running.</p>';
  }
}

load();
