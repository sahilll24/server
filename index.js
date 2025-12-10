import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createNotificationEmail, createConfirmationEmail } from './emailTemplates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
app.use(cors());
app.use(express.json());

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password for Gmail
    },
  });
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
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
      

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'sahilsaykar24@gmail.com';

    // Email 1: Notification to you
    const notificationHtml = createNotificationEmail(name, email, subject, message);
    
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: notificationHtml,
      replyTo: email,
    });

    // Email 2: Confirmation to the sender
    const confirmationHtml = createConfirmationEmail(name, subject);

    await transporter.sendMail({
      from: `"Sahil Saykar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for reaching out!',
      html: confirmationHtml,
    });

    res.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export app for testing
export { app };

// Start server only if this file is run directly (not imported for testing)
// Vitest sets VITEST environment variable
const isTestMode = process.env.VITEST !== undefined;

if (!isTestMode) {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

