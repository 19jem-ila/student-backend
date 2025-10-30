import Fee from "../models/feeModel.js";
import Student from "../models/studentModel.js";

// ---------------- CREATE FEE RECORD ----------------
export const createFee = async (req, res) => {
  try {
    const { student, term, feeAmount, dueDate, paidDate, status, paymentMethod, receiptNumber } = req.body;

    // Check if student exists
    const existingStudent = await Student.findById(student);
    if (!existingStudent) return res.status(404).json({ message: "Student not found" });

    const fee = await Fee.create({
      student,
      term,
      feeAmount,
      dueDate,
      paidDate: paidDate || null,
      status: status || "Pending",
      paymentMethod,
      receiptNumber,
    });

    res.status(201).json({ message: "Fee record created successfully", fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ALL FEES ----------------
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("student", "name rollNumber")
      .populate("term", "name");

    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE FEE ----------------
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate("student", "name rollNumber")
      .populate("term", "name");

    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE FEE ----------------
export const updateFee = async (req, res) => {
  try {
    const { term, feeAmount, dueDate, paidDate, status, paymentMethod, receiptNumber } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    fee.term = term || fee.term;
    fee.feeAmount = feeAmount || fee.feeAmount;
    fee.dueDate = dueDate || fee.dueDate;
    fee.paidDate = paidDate || fee.paidDate;
    fee.status = status || fee.status;
    fee.paymentMethod = paymentMethod || fee.paymentMethod;
    fee.receiptNumber = receiptNumber || fee.receiptNumber;

    await fee.save();

    res.json({ message: "Fee record updated successfully", fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE FEE ----------------
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    res.json({ message: "Fee record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
