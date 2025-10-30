import Attendance from "../models/attendanceModel.js";
import Student from "../models/studentModel.js";

// ---------------- CREATE ATTENDANCE ----------------
export const createAttendance = async (req, res) => {
  try {
    const { student, class: classId, attendanceDate, status, remarks, term } = req.body;
    
    

    // Check if student exists
    const existingStudent = await Student.findById(student);
    if (!existingStudent) return res.status(404).json({ message: "Student not found" });

    // Optional: check if attendance already exists for same student & date
    const existingAttendance = await Attendance.findOne({ student, attendanceDate });
    if (existingAttendance)
      return res.status(400).json({ message: "Attendance already recorded for this student on this date" });
    

    const attendance = await Attendance.create({
      student,
      class: classId,
      attendanceDate,
      status,
      remarks,
      term,
      teacher: req.user._id, // logged-in teacher/admin
    });
    

    res.status(201).json({ message: "Attendance recorded successfully", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL ATTENDANCE ----------------
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student", "name rollNumber")
      .populate("class", "name")
      .populate("teacher", "name email")
      .populate("term", "name");

    res.json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ATTENDANCE BY ID ----------------
export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("student", "name rollNumber")
      .populate("class", "name")
      .populate("teacher", "name email")
      .populate("term", "name");

    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE ATTENDANCE ----------------
export const updateAttendance = async (req, res) => {
  try {
    const { student, class: classId, attendanceDate, status, remarks, term } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    attendance.student = student || attendance.student;
    attendance.class = classId || attendance.class;
    attendance.attendanceDate = attendanceDate || attendance.attendanceDate;
    attendance.status = status || attendance.status;
    attendance.remarks = remarks || attendance.remarks;
    attendance.term = term || attendance.term;

    await attendance.save();

    res.json({ message: "Attendance updated successfully", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE ATTENDANCE ----------------
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
