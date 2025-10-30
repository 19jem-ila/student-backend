import ClassModel from "../models/classModel.js";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";

// ---------------- CREATE CLASS ----------------
export const createClass = async (req, res) => {
  try {
    const { name, section, teacher, students } = req.body;

    // Validate teacher
    if (teacher) {
      const existingTeacher = await User.findById(teacher);
      if (!existingTeacher || existingTeacher.role !== "teacher")
        return res.status(400).json({ message: "Teacher not found or invalid role" });
    }

    // Validate students
    let validStudents = [];
    if (students && students.length > 0) {
      validStudents = await Student.find({ _id: { $in: students } });
      if (validStudents.length !== students.length)
        return res.status(400).json({ message: "Some students not found" });
    }

    const newClass = await ClassModel.create({
      name,
      section,
      teacher,
      students: validStudents.map(s => s._id),
    });

    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL CLASSES ----------------
export const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find()
      .populate("teacher", "name email")
      .populate("students", "name rollNumber");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE CLASS ----------------
export const getClassById = async (req, res) => {
  try {
    const classItem = await ClassModel.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name rollNumber");
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE CLASS ----------------
export const updateClass = async (req, res) => {
  try {
    const { name, section, teacher, students } = req.body;
    const classItem = await ClassModel.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });

    // Validate teacher
    if (teacher) {
      const existingTeacher = await User.findById(teacher);
      if (!existingTeacher || existingTeacher.role !== "teacher")
        return res.status(400).json({ message: "Teacher not found or invalid role" });
      classItem.teacher = teacher;
    }

    // Validate students
    if (students && students.length > 0) {
      const validStudents = await Student.find({ _id: { $in: students } });
      if (validStudents.length !== students.length)
        return res.status(400).json({ message: "Some students not found" });
      classItem.students = validStudents.map(s => s._id);
    }

    classItem.name = name || classItem.name;
    classItem.section = section || classItem.section;

    await classItem.save();

    res.json({ message: "Class updated successfully", class: classItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE CLASS ----------------
export const deleteClass = async (req, res) => {
  try {
    const classItem = await ClassModel.findByIdAndDelete(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
