import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Math, Physics
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher responsible
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
