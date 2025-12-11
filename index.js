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
const PORT = process.env.PORT || 3002;

// =========================================================
// 🔥 CORS (Railway + Vercel + Localhost)
// =========================================================
const allowedOrigins = [
  "https://sahilsaykarcom.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.railway\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

// =========================================================
// Middlewares
// =========================================================
app.use(express.json());

// =========================================================
// Nodemailer Transporter (Railway compatible)
// =========================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,          // 🔥 Railway supports this
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
    tls: {
      rejectUnauthorized: false,
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    const transporter = createTransporter();
    const recipientEmail =
      process.env.RECIPIENT_EMAIL || "sahilsaykar24@gmail.com";

    // Email 1 → To you
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

    // Email 2 → Confirmation to user
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
