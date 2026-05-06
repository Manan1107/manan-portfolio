const API_BASE = "http://localhost:5000/api";

export function getAdminKey() {
  const field = document.getElementById("adminKey");
  const key = field ? field.value.trim() : "";
  return key || "";
}

export function setupAdminKeyField() {
  const field = document.getElementById("adminKey");
  if (!field) return;
  field.value = "";
}

export async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function apiPost(endpoint, payload) {
  const key = getAdminKey();
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": key },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unauthorized or request failed");
  return res.json();
}

export async function apiPut(endpoint, payload) {
  const key = getAdminKey();
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": key },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unauthorized or update failed");
  return res.json();
}

export async function apiDelete(endpoint) {
  const key = getAdminKey();
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "DELETE",
    headers: { "x-admin-key": key },
  });
  if (!res.ok) throw new Error("Unauthorized or delete failed");
}
