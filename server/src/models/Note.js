import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    noteDate: { type: Date, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
