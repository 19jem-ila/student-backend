import Student from "../models/studentModel.js";

// ---------------- CREATE STUDENT ----------------
export const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, dateOfBirth, address, parentName, parentContact, photo, class: classId } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) return res.status(400).json({ message: "Student with this roll number already exists" });

    const student = await Student.create({
      name,
      rollNumber,
      dateOfBirth,
      address,
      parentName,
      parentContact,
      photo,
      class: classId,
    });

    res.status(201).json({ message: "Student created successfully", student });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL STUDENTS ----------------
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("class", "name"); // populate class name
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE STUDENT ----------------
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("class", "name");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE STUDENT ----------------
export const updateStudent = async (req, res) => {
  try {
    const { name, rollNumber, dateOfBirth, address, parentName, parentContact, photo, class: classId, isActive } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.name = name || student.name;
    student.rollNumber = rollNumber || student.rollNumber;
    student.dateOfBirth = dateOfBirth || student.dateOfBirth;
    student.address = address || student.address;
    student.parentName = parentName || student.parentName;
    student.parentContact = parentContact || student.parentContact;
    student.photo = photo || student.photo;
    student.class = classId || student.class;
    if (typeof isActive === "boolean") student.isActive = isActive;

    await student.save();

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE STUDENT ----------------
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
