import Grade from "../models/gradeModel.js";
import Student from "../models/studentModel.js";
import Subject from "../models/subjectModel.js";

// ---------------- CREATE GRADE ----------------
export const createGrade = async (req, res) => {
  try {
    const { student, subject, score, term, year, remarks } = req.body;

    // Check if student exists
    const existingStudent = await Student.findById(student);
    if (!existingStudent) return res.status(404).json({ message: "Student not found" });

    // Check if subject exists
    const existingSubject = await Subject.findById(subject);
    if (!existingSubject) return res.status(404).json({ message: "Subject not found" });

    // Auto-calculate gradeLetter
    let gradeLetter = "";
    if (score >= 90) gradeLetter = "A";
    else if (score >= 80) gradeLetter = "B";
    else if (score >= 70) gradeLetter = "C";
    else if (score >= 60) gradeLetter = "D";
    else gradeLetter = "F";

    const grade = await Grade.create({
      student,
      subject,
      teacher: req.user._id,
      score,
      gradeLetter,
      term,
      year: year || new Date().getFullYear(),
      remarks,
    });

    res.status(201).json({ message: "Grade recorded successfully", grade });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL GRADES ----------------
export const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("student", "name rollNumber")
      .populate("subject", "name")
      .populate("teacher", "name email")
      .populate("term", "name");

    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE GRADE ----------------
export const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate("student", "name rollNumber")
      .populate("subject", "name")
      .populate("teacher", "name email")
      .populate("term", "name");

    if (!grade) return res.status(404).json({ message: "Grade not found" });

    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE GRADE ----------------
export const updateGrade = async (req, res) => {
  try {
    const { student, subject, score, term, year, remarks } = req.body;

    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    grade.student = student || grade.student;
    grade.subject = subject || grade.subject;
    grade.score = score || grade.score;
    grade.term = term || grade.term;
    grade.year = year || grade.year;
    grade.remarks = remarks || grade.remarks;

    // Recalculate gradeLetter if score changed
    if (score !== undefined) {
      if (score >= 90) grade.gradeLetter = "A";
      else if (score >= 80) grade.gradeLetter = "B";
      else if (score >= 70) grade.gradeLetter = "C";
      else if (score >= 60) grade.gradeLetter = "D";
      else grade.gradeLetter = "F";
    }

    await grade.save();

    res.json({ message: "Grade updated successfully", grade });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE GRADE ----------------
export const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
