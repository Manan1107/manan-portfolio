import { apiGet, esc, formatDate } from "/public-pages.js";

const noteEl = document.getElementById("note");
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
    const notes = await apiGet("notes");
    const note = notes.find((n) => n._id === id);

    if (!note) {
      titleEl.textContent = "Note not found";
      subtitleEl.textContent = "This link may be wrong or the note was removed.";
      noteEl.innerHTML = `
        <div class="meta">Notes</div>
        <h2>Missing note</h2>
        <p>Go back to the <a href="/notes/index.html">notes list</a>.</p>
      `;
      return;
    }

    const dateValue = note.noteDate || note.createdAt;
    const pageTitle = note.title || "Untitled";
    document.title = `${pageTitle} | Manan Javiya`;
    titleEl.textContent = pageTitle;
    subtitleEl.textContent = formatDate(dateValue);

    noteEl.innerHTML = `
      <div class="meta">${formatDate(dateValue)}</div>
      <h2>${esc(pageTitle)}</h2>
      <div class="content">${toParagraphs(note.text)}</div>
      <a class="back-link" href="/notes/index.html">← Back to Notes</a>
    `;
  } catch {
    titleEl.textContent = "Could not load";
    subtitleEl.textContent = "Please try again.";
    noteEl.innerHTML = `<p class="status">Could not load this note.</p>`;
  }
}

load();

