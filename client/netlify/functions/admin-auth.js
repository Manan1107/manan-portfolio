const json = (body, statusCode = 200) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }

  const payload = event.body ? JSON.parse(event.body) : {};
  const isValid = Boolean(process.env.ADMIN_KEY && payload.key === process.env.ADMIN_KEY);

  if (!isValid) {
    return json({ success: false, message: "Unauthorized" }, 401);
  }

  return json({ success: true });
};
