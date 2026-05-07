import { verifyAdminKey } from "/admin/admin-common.js";

const savedKey = sessionStorage.getItem("mananAdminKey") || "";
const page = document.querySelector(".wrap");

if (page) {
  page.hidden = true;
}

const gate = document.createElement("div");
gate.className = "admin-gate";
gate.innerHTML = `
  <form class="admin-gate-card">
    <h1>Admin Access</h1>
    <p>Enter your admin key to manage this page.</p>
    <input name="key" type="password" placeholder="Admin key" autocomplete="current-password" required />
    <button type="submit">Unlock</button>
    <p class="gate-status"></p>
  </form>
`;
document.body.prepend(gate);

const form = gate.querySelector("form");
const field = gate.querySelector("input");
const statusEl = gate.querySelector(".gate-status");

async function unlock(key) {
  statusEl.textContent = "Checking...";
  await verifyAdminKey(key);
  sessionStorage.setItem("mananAdminKey", key);
  const adminField = document.getElementById("adminKey");
  if (adminField) adminField.value = key;
  gate.remove();
  if (page) page.hidden = false;
  window.dispatchEvent(new CustomEvent("manan-admin-ready"));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await unlock(field.value.trim());
  } catch {
    statusEl.textContent = "Invalid admin key.";
  }
});

if (savedKey) {
  field.value = savedKey;
  unlock(savedKey).catch(() => {
    sessionStorage.removeItem("mananAdminKey");
    statusEl.textContent = "Enter admin key.";
  });
}
