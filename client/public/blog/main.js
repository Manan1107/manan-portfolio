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
          <a class="item-link" href="/blog/post.html?id=${encodeURIComponent(post._id)}" aria-label="Open ${esc(post.title)}">
            <article class="item">
              <div class="meta">${formatDate(post.createdAt)}</div>
              <h2>${esc(post.title)}</h2>
              <p class="clamp-2">${esc(post.content)}</p>
            </article>
          </a>
        `
      )
      .join("");
  } catch {
    list.innerHTML = '<p class="status">Could not load blog posts.</p>';
  }
}

load();
