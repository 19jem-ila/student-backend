import Subject from "../models/subjectModel.js";
import User from "../models/userModel.js";
import ClassModel from "../models/classModel.js"; // Assuming you have a Class model

// ---------------- CREATE SUBJECT ----------------
export const createSubject = async (req, res) => {
  try {
    const { name, teacher, class: classId } = req.body;

    // Check if teacher exists
    if (teacher) {
      const existingTeacher = await User.findById(teacher);
      if (!existingTeacher || existingTeacher.role !== "teacher")
        return res.status(400).json({ message: "Teacher not found or invalid role" });
    }

    // Check if class exists
    if (classId) {
      const existingClass = await ClassModel.findById(classId);
      if (!existingClass) return res.status(404).json({ message: "Class not found" });
    }

    const subject = await Subject.create({ name, teacher, class: classId });

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL SUBJECTS ----------------
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teacher", "name email")
      .populate("class", "name");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE SUBJECT ----------------
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("class", "name");

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE SUBJECT ----------------
export const updateSubject = async (req, res) => {
  try {
    const { name, teacher, class: classId } = req.body;

    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Optional: validate teacher
    if (teacher) {
      const existingTeacher = await User.findById(teacher);
      if (!existingTeacher || existingTeacher.role !== "teacher")
        return res.status(400).json({ message: "Teacher not found or invalid role" });
      subject.teacher = teacher;
    }

    // Optional: validate class
    if (classId) {
      const existingClass = await ClassModel.findById(classId);
      if (!existingClass) return res.status(404).json({ message: "Class not found" });
      subject.class = classId;
    }

    subject.name = name || subject.name;

    await subject.save();

    res.json({ message: "Subject updated successfully", subject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE SUBJECT ----------------
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
