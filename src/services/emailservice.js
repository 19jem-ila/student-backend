import nodemailer from "nodemailer";

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,  // e.g., smtp.gmail.com
      port: process.env.EMAIL_PORT,  // e.g., 587
      secure: false,                 // true for port 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2️⃣ Define email options
    const mailOptions = {
      from: `"SMS System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, // ✅ send as HTML
    };

    // 3️⃣ Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
