import { apiGet, esc, formatDate } from "/public-pages.js";

const list = document.getElementById("list");

async function load() {
  try {
    const notes = await apiGet("notes");
    if (!notes.length) {
      list.innerHTML = '<p class="status">No notes yet.</p>';
      return;
    }

    list.innerHTML = notes
      .map(
        (note) => `
          <article class="item">
            <div class="meta">${formatDate(note.noteDate || note.createdAt)}</div>
            <h2>${esc(note.title || "Untitled")}</h2>
            <p>${esc(note.text)}</p>
          </article>
        `
      )
      .join("");
  } catch {
    list.innerHTML = '<p class="status">Could not load notes. Make sure the backend is running.</p>';
  }
}

load();
