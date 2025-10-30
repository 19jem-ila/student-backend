import AcademicTerm from "../models/AcademicTermmodel.js";

// ---------------- CREATE TERM ----------------
export const createTerm = async (req, res) => {
  try {
    const { name, startDate, endDate, year } = req.body;

    const newTerm = await AcademicTerm.create({
      name,
      startDate,
      endDate,
      year: year || new Date().getFullYear(),
    });

    res.status(201).json({ message: "Term created successfully", term: newTerm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL TERMS ----------------
export const getAllTerms = async (req, res) => {
  try {
    const terms = await AcademicTerm.find();
    res.json(terms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE TERM ----------------
export const getTermById = async (req, res) => {
  try {
    const term = await AcademicTerm.findById(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });
    res.json(term);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE TERM ----------------
export const updateTerm = async (req, res) => {
  try {
    const { name, startDate, endDate, year } = req.body;
    const term = await AcademicTerm.findById(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });

    term.name = name || term.name;
    term.startDate = startDate || term.startDate;
    term.endDate = endDate || term.endDate;
    term.year = year || term.year;

    await term.save();

    res.json({ message: "Term updated successfully", term });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE TERM ----------------
export const deleteTerm = async (req, res) => {
  try {
    const term = await AcademicTerm.findByIdAndDelete(req.params.id);
    if (!term) return res.status(404).json({ message: "Term not found" });
    res.json({ message: "Term deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
