import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {
  createNotificationEmail,
  createConfirmationEmail,
} from "./emailTemplates.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================
// 🔥 STRICT CORS FOR RENDER + VERCEL
// =========================================================
const allowedOrigins = [
  "https://sahilsaykar-abrfh2if7-sahilsaykars-projects.vercel.app", // Vercel frontend
  "http://localhost:5173", // Local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("CORS Not Allowed"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// Preflight OPTIONS
app.options("*", cors());

// =========================================================
// Middlewares
// =========================================================
app.use(express.json());

// =========================================================
// Nodemailer Transporter
// =========================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail app password
    },
  });
};

// =========================================================
// 📩 CONTACT FORM API
// =========================================================
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.RECIPIENT_EMAIL || "sahilsaykar24@gmail.com";

    // Email 1 → You
    const notificationHTML = createNotificationEmail(
      name,
      email,
      subject,
      message
    );

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: notificationHTML,
      replyTo: email,
    });

    // Email 2 → User
    const confirmationHTML = createConfirmationEmail(name, subject);

    await transporter.sendMail({
      from: `"Sahil Saykar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting me!",
      html: confirmationHTML,
    });

    res.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.log("❌ Email Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }
});

// =========================================================
// Health Check
// =========================================================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// =========================================================
// Start Server
// =========================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
