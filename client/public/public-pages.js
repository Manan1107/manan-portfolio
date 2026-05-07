export function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatDate(value) {
  return new Date(value || Date.now()).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export async function apiGet(endpoint) {
  const files = {
    blogs: "/content/blogs.json",
    notes: "/content/notes.json",
  };
  const res = await fetch(files[endpoint], { cache: "no-store" });
  if (!res.ok) throw new Error("Request failed");
  const items = await res.json();
  return items.map((item, index) => ({
    _id: `${endpoint}-${index}`,
    createdAt: item.date,
    noteDate: item.date,
    title: item.title,
    content: item.content,
    text: item.content,
  }));
}
