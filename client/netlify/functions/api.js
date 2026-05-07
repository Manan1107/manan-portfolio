import { getStore } from "@netlify/blobs";

const json = (body, statusCode = 200) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

const allowedTypes = new Set(["blogs", "notes"]);

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const requireAdmin = (event) => {
  const key = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  return Boolean(process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
};

const getItems = async (type) => {
  const store = getStore("portfolio-content");
  const items = await store.get(`${type}.json`, { type: "json" });
  return Array.isArray(items) ? items : [];
};

const setItems = async (type, items) => {
  const store = getStore("portfolio-content");
  await store.setJSON(`${type}.json`, items);
};

const normalizeBlog = (payload, existing = {}) => ({
  _id: existing._id || makeId(),
  title: String(payload.title || existing.title || "").trim(),
  content: String(payload.content || existing.content || "").trim(),
  createdAt: existing.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const normalizeNote = (payload, existing = {}) => ({
  _id: existing._id || makeId(),
  title: String(payload.title || existing.title || "").trim(),
  text: String(payload.text || existing.text || "").trim(),
  noteDate: payload.noteDate || existing.noteDate || new Date().toISOString().slice(0, 10),
  createdAt: existing.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const handler = async (event) => {
  const parts = event.path
    .replace(/^\/api\/?/, "")
    .replace(/^\/?\.netlify\/functions\/api\/?/, "")
    .split("/")
    .filter(Boolean);
  const [type, id] = parts;

  if (!allowedTypes.has(type)) {
    return json({ success: false, message: "Not found" }, 404);
  }

  try {
    if (event.httpMethod === "GET") {
      const items = await getItems(type);
      return json(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }

    if (!requireAdmin(event)) {
      return json({ success: false, message: "Unauthorized" }, 401);
    }

    const payload = event.body ? JSON.parse(event.body) : {};
    const items = await getItems(type);
    const normalize = type === "blogs" ? normalizeBlog : normalizeNote;

    if (event.httpMethod === "POST") {
      const item = normalize(payload);
      if ((type === "blogs" && (!item.title || !item.content)) || (type === "notes" && (!item.title || !item.text))) {
        return json({ success: false, message: "Missing required fields" }, 400);
      }
      const next = [item, ...items];
      await setItems(type, next);
      return json(item, 201);
    }

    const index = items.findIndex((item) => item._id === id);
    if (index === -1) {
      return json({ success: false, message: "Item not found" }, 404);
    }

    if (event.httpMethod === "PUT") {
      const item = normalize(payload, items[index]);
      const next = [...items];
      next[index] = item;
      await setItems(type, next);
      return json(item);
    }

    if (event.httpMethod === "DELETE") {
      await setItems(type, items.filter((item) => item._id !== id));
      return json({ success: true });
    }

    return json({ success: false, message: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Content API failed:", error);
    return json({ success: false, message: "Content API failed" }, 500);
  }
};
