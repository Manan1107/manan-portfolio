import { apiDelete, apiGet, apiPost, apiPut, setupAdminKeyField } from "/admin/admin-common.js";

const form = document.getElementById("form");
const list = document.getElementById("list");
const statusEl = document.getElementById("status");
let editingId = "";

setupAdminKeyField();

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function load() {
  const items = await apiGet("blogs");
  list.innerHTML = items
    .map(
      (item) => `
      <article class="item">
        <p class="meta">${new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.content)}</p>
        <div class="actions">
          <button class="secondary" data-edit="${item._id}" data-title="${esc(item.title)}" data-content="${esc(item.content)}" type="button">Edit</button>
          <button data-id="${item._id}" type="button">Delete</button>
        </div>
      </article>
    `
    )
    .join("");
  list.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      editingId = btn.getAttribute("data-edit");
      form.elements.title.value = btn.getAttribute("data-title") || "";
      form.elements.content.value = btn.getAttribute("data-content") || "";
      form.querySelector("button[type='submit']").textContent = "Update Post";
      statusEl.textContent = "Editing selected post.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  list.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await apiDelete(`blogs/${btn.getAttribute("data-id")}`);
      load();
    });
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  statusEl.textContent = editingId ? "Updating..." : "Publishing...";
  try {
    const payload = { title: fd.get("title"), content: fd.get("content") };
    if (editingId) {
      await apiPut(`blogs/${editingId}`, payload);
    } else {
      await apiPost("blogs", payload);
    }
    form.reset();
    editingId = "";
    form.querySelector("button[type='submit']").textContent = "Publish";
    statusEl.textContent = "Saved.";
    load();
  } catch {
    statusEl.textContent = "Unauthorized. Check admin key.";
  }
});

load();
