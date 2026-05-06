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
  const items = await apiGet("notes");
  list.innerHTML = items
    .map(
      (item) => `
      <article class="item">
        <p class="meta">${new Date(item.noteDate || item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
        <h3>${esc(item.title || "Untitled")}</h3>
        <p>${esc(item.text)}</p>
        <div class="actions">
          <button class="secondary" data-edit="${item._id}" data-title="${esc(item.title || "")}" data-date="${new Date(item.noteDate || item.createdAt).toISOString().slice(0, 10)}" data-text="${esc(item.text)}" type="button">Edit</button>
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
      form.elements.noteDate.value = btn.getAttribute("data-date") || "";
      form.elements.text.value = btn.getAttribute("data-text") || "";
      form.querySelector("button[type='submit']").textContent = "Update Note";
      statusEl.textContent = "Editing selected note.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  list.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await apiDelete(`notes/${btn.getAttribute("data-id")}`);
      load();
    });
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  statusEl.textContent = editingId ? "Updating..." : "Saving...";
  try {
    const payload = {
      title: fd.get("title"),
      noteDate: fd.get("noteDate"),
      text: fd.get("text"),
    };
    if (editingId) {
      await apiPut(`notes/${editingId}`, payload);
    } else {
      await apiPost("notes", payload);
    }
    form.reset();
    editingId = "";
    form.querySelector("button[type='submit']").textContent = "Save";
    statusEl.textContent = "Saved.";
    load();
  } catch {
    statusEl.textContent = "Unauthorized. Check admin key.";
  }
});

load();
