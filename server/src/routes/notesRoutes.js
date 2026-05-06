import express from "express";
import Note from "../models/Note.js";

const router = express.Router();
const requireAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

router.get("/", async (_req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

router.post("/", requireAdmin, async (req, res) => {
  const payload = {
    title: req.body.title,
    text: req.body.text,
    noteDate: req.body.noteDate,
  };
  const note = await Note.create(payload);
  res.status(201).json(note);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      text: req.body.text,
      noteDate: req.body.noteDate,
    },
    { new: true, runValidators: true }
  );
  if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  res.json(note);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
