import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // optional
    attendanceDate: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
    remarks: { type: String }, // optional: "sick leave"
    term: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicTerm" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
