import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from "./src/config/db.js"; 
import authRoutes from "./src/routes/authRoute.js"; 
import userRoutes from "./src/routes/userRoute.js";
import studentRoutes from "./src/routes/studentRoute.js"
import attendanceRoutes from "./src/routes/attendanceRoute.js"
import feeRoutes from "./src/routes/feeRoute.js"
import gradeRoutes from "./src/routes/gradeRoute.js"
import classRoutes from "./src/routes/classRoute.js"
import subjectRoutes from "./src/routes/subjectRoute.js"
import academicRoutes from "./src/routes/AcademicRoute.js"


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fee", feeRoutes);
app.use("/api/grade", gradeRoutes);
app.use("/api/class", classRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/term", academicRoutes);




// Home route
app.get("/", (req, res) => {
  res.send("SMS Backend is running");


});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


