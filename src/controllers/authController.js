import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../services/emailservice.js"; 

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

  
    

const isMatch = await user.matchPassword(password);




if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ message: "User is deactivated" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- CREATE FIRST ADMIN ----------------
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Do NOT hash manually here
    const admin = await User.create({
      name,
      email,
      password, // plain text, schema will hash it
      role: "admin",
    });

    res.status(201).json({ message: "First admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create user

function generateStrongPassword(length = 10) {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Ensure at least one of each type
  const getRandom = (set) => set[Math.floor(Math.random() * set.length)];

  let password = [
    getRandom(letters),
    getRandom(letters.toUpperCase()),
    getRandom(numbers),
    getRandom(specialChars),
  ];

  // Fill the rest randomly
  const allChars = letters + numbers + specialChars;
  while (password.length < length) {
    password.push(getRandom(allChars));
  }

  // Shuffle password for randomness
  password = password.sort(() => Math.random() - 0.5).join("");
  return password;
}

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    console.log("Request Body:", req.body);

    if (!["admin", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Generate a strong password
    const password = generateStrongPassword(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Try to send email (non-blocking)
    try {
      const emailMessage = `
Hello ${name},

Your account has been created in the SMS system.
Email: ${email}
Password: ${password}

Please log in and change your password immediately.
      `;
      await sendEmail(email, "Your SMS Login Credentials", emailMessage);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
      return res.status(201).json({
        message: "User created, but email could not be sent",
        newUser,
      });
    }

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
  <p>Hello ${user.name},</p>
  <p>You requested a password reset.</p>
  <p>Click the link below to reset your password:</p>
  <p><a href="${resetUrl}" target="_blank" style="color:blue;">Reset Password</a></p>
  <p>This link will expire in 15 minutes.</p>
  <p>If you did not request this, please ignore this email.</p>
`;

    // Send email safely
    try {
      await sendEmail(user.email, "Password Reset Request", message);

      res.json({ message: "Password reset email sent" });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
      res.status(200).json({
        message: "Reset token generated, but email could not be sent. Contact admin.",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword; // ✅ no need to hash manually
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
