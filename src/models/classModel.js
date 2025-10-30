import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Grade 10
    section: { type: String }, // e.g., A, B
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // class teacher
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
