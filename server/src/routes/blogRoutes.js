import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();
const requireAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

router.get("/", async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.post("/", requireAdmin, async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true, runValidators: true }
  );
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  res.json(blog);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
