import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createNotificationEmail, createConfirmationEmail } from './emailTemplates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================
// 🔥 CORS FIX — REQUIRED FOR VERCEL + RENDER CONNECTION
// =========================================================
const allowedOrigins = [
  "https://sahilsaykar-abrfh2if7-sahilsaykars-projects.vercel.app",  // your Vercel frontend
  "http://localhost:5173"  // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

// =========================================================
// Middleware
// =========================================================
app.use(express.json());

// =========================================================
// Nodemailer Transporter
// =========================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });
};

// =========================================================
// 📩 Contact Form API
// =========================================================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'sahilsaykar24@gmail.com';

    // 1️⃣ Email to YOU (Notification)
    const notificationHtml = createNotificationEmail(
      name,
      email,
      subject,
      message
    );

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: notificationHtml,
      replyTo: email,
    });

    // 2️⃣ Confirmation Email to Sender
    const confirmationHtml = createConfirmationEmail(name, subject);

    await transporter.sendMail({
      from: `"Sahil Saykar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      html: confirmationHtml,
    });

    res.json({
      success: true,
      message: 'Email sent successfully!',
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.',
    });
  }
});

// =========================================================
// Health Check Endpoint
// =========================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// =========================================================
// Start Server
// =========================================================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
