import mongoose from "mongoose";

const termSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., First Term
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    year: { type: Number, default: new Date().getFullYear() },
  },
  { timestamps: true }
);

export default mongoose.model("AcademicTerm", termSchema);
