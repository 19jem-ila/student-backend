import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendEmail from "../services/emailservice.js";

// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (req, res) => {
  try {
    // Only fetch admins and teachers
    const users = await User.find({ role: { $in: ["admin", "teacher"] } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SINGLE USER ----------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE USER ----------------
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, phone, dateOfBirth, address, bio, profilePicture } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate role
    if (role && !["admin", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or teacher" });
    }

    // Update fields if provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (typeof isActive === "boolean") user.isActive = isActive;
    user.phone = phone || user.phone;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.address = address || user.address;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: err.message });
  }
  
};


// ---------------- DELETE USER ----------------
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- RESET USER PASSWORD (BY ADMIN) ----------------
export const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a random password
    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send email with new password
    const message = `
Hello ${user.name},

Your password has been reset by the admin.
New password: ${newPassword}

Please log in and change your password immediately.
    `;
    await sendEmail(user.email, "SMS Password Reset by Admin", message);

    res.json({ message: "User password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
