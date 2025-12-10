// Email template matching site color scheme
// Primary: hsl(258, 89%, 66%) - purple
// Secondary: hsl(240, 5%, 33%) - dark gray
// Background: hsl(240, 4%, 95%) - light gray

export const createNotificationEmail = (name, email, subject, message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: hsl(240, 5%, 10%);
            background-color: hsl(240, 4%, 95%);
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: hsl(0, 0%, 98%);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, hsl(258, 89%, 66%) 0%, hsl(263, 70%, 50%) 100%);
            padding: 2rem;
            text-align: center;
            color: hsl(250, 100%, 97%);
        }
        .header h1 {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 700;
        }
        .content {
            padding: 2rem;
        }
        .info-section {
            background-color: hsl(269, 100%, 98%);
            border-left: 4px solid hsl(258, 89%, 66%);
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0.5rem;
        }
        .info-item {
            margin: 0.75rem 0;
        }
        .info-label {
            font-weight: 600;
            color: hsl(240, 5%, 33%);
            display: inline-block;
            min-width: 80px;
        }
        .info-value {
            color: hsl(240, 5%, 10%);
        }
        .message-box {
            background-color: hsl(240, 4%, 95%);
            border: 1px solid hsl(240, 4%, 83%);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        .message-box p {
            margin: 0;
            color: hsl(240, 5%, 10%);
            white-space: pre-wrap;
        }
        .footer {
            background-color: hsl(240, 5%, 33%);
            color: hsl(0, 0%, 98%);
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
        }
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: hsl(258, 89%, 66%);
            color: hsl(250, 100%, 97%);
            text-decoration: none;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-weight: 600;
        }
        .btn:hover {
            background-color: hsl(258, 89%, 60%);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <p>Someone has reached out through your portfolio contact form!</p>
            
            <div class="info-section">
                <div class="info-item">
                    <span class="info-label">Name:</span>
                    <span class="info-value"><strong>${escapeHtml(name)}</strong></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${escapeHtml(email)}" style="color: hsl(258, 89%, 66%); text-decoration: none;">${escapeHtml(email)}</a></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Subject:</span>
                    <span class="info-value">${escapeHtml(subject)}</span>
                </div>
            </div>

            <div class="message-box">
                <h3 style="margin-top: 0; color: hsl(240, 5%, 33%); font-size: 1rem;">Message:</h3>
                <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            </div>

            <p style="text-align: center;">
                <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}" class="btn">
                    Reply to ${escapeHtml(name)}
                </a>
            </p>
        </div>
        <div class="footer">
            <p>Portfolio Contact Form Notification</p>
        </div>
    </div>
</body>
</html>
  `;
};

export const createConfirmationEmail = (name, subject) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for reaching out!</title>
    <style>
        body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: hsl(240, 5%, 10%);
            background-color: hsl(240, 4%, 95%);
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: hsl(0, 0%, 98%);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, hsl(258, 89%, 66%) 0%, hsl(263, 70%, 50%) 100%);
            padding: 2rem;
            text-align: center;
            color: hsl(250, 100%, 97%);
        }
        .header h1 {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 700;
        }
        .content {
            padding: 2rem;
        }
        .message {
            background-color: hsl(269, 100%, 98%);
            border-left: 4px solid hsl(258, 89%, 66%);
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0.5rem;
        }
        .highlight {
            color: hsl(258, 89%, 66%);
            font-weight: 600;
        }
        .footer {
            background-color: hsl(240, 5%, 33%);
            color: hsl(0, 0%, 98%);
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
        }
        .social-links {
            margin-top: 1.5rem;
            text-align: center;
        }
        .social-links a {
            color: hsl(258, 89%, 66%);
            text-decoration: none;
            margin: 0 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Thank You!</h1>
        </div>
        <div class="content">
            <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
            
            <div class="message">
                <p>Thank you for reaching out! I've received your message regarding <span class="highlight">"${escapeHtml(subject)}"</span> and I appreciate you taking the time to contact me.</p>
                
                <p>I'll review your message and get back to you as soon as possible. Typically, I respond within 24-48 hours.</p>
                
                <p>Looking forward to connecting with you soon!</p>
            </div>

            <p>Best regards,<br>
            <strong>Sahil Saykar</strong><br>
            DevOps Engineer</p>

            <div class="social-links">
                <p style="color: hsl(240, 5%, 33%); font-size: 0.875rem; margin-top: 2rem;">
                    Portfolio Contact Form • sahilsaykar24@gmail.com
                </p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

