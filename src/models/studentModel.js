import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll_number: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date },
    address: { type: String },
    parentName: { type: String },
    parentContact: { type: String, required: true },
    photo: { type: String }, // optional profile photo
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
