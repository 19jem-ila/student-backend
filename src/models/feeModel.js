import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicTerm" },
    feeAmount: { type: Number, required: true },
    dueDate: { type: Date },
    paidDate: { type: Date, default: null },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    paymentMethod: { type: String }, // optional: cash, card, online
    receiptNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
