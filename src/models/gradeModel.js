import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    score: { type: Number, required: true, min: 0, max: 100 },
    gradeLetter: { type: String }, // optional, can be auto-calculated
    term: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicTerm" },
    year: { type: Number, default: new Date().getFullYear() },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Grade", gradeSchema);
