const API_BASE = "http://localhost:5000/api";

export function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function formatDate(value) {
  return new Date(value || Date.now()).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
