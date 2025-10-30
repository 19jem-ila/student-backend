import Joi from "joi";

// Password regex: min 8 chars, 1 uppercase, 1 number, 1 special char
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

// ---------------- LOGIN VALIDATION ----------------
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
  }),
});

// ---------------- CREATE USER VALIDATION ----------------
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  role: Joi.string().valid("admin", "teacher").required().messages({
    "any.only": "Role must be admin or teacher",
    "string.empty": "Role is required",
  }),
  
});

export const createAdminSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern).required(),
  });

// ---------------- FORGOT PASSWORD VALIDATION ----------------
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
});

// ---------------- RESET PASSWORD VALIDATION ----------------
export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "New password is required",
    "string.pattern.base":
      "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
  }),
});

// ---------------- CHANGE PASSWORD VALIDATION ----------------
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "Current password is required",
    "string.pattern.base":
      "Current password must be at least 8 characters, include one uppercase letter, one number, and one special character",
  }),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "New password is required",
    "string.pattern.base":
      "New password must be at least 8 characters, include one uppercase letter, one number, and one special character",
  }),
});
