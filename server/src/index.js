import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Manan Portfolio API is running." });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/contact", contactRoutes);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
