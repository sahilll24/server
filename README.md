# Contact Form API Server

Backend server for handling contact form submissions and sending emails.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the `server` directory:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=sahilsaykar24@gmail.com
PORT=3001
```

3. **Important: Gmail App Password Setup**
   - Go to your Google Account settings
   - Enable 2-Step Verification if not already enabled
   - Go to Security > App passwords
   - Create a new app password for "Mail"
   - Use that password in `EMAIL_PASS` (not your regular Gmail password)

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST `/api/contact`
Sends two emails:
1. Notification email to you (sahilsaykar24@gmail.com)
2. Confirmation email to the sender

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

### GET `/api/health`
Health check endpoint.

## Email Templates

The email templates match your site's color scheme:
- Primary: hsl(258, 89%, 66%) - Purple
- Secondary: hsl(240, 5%, 33%) - Dark gray
- Background: hsl(240, 4%, 95%) - Light gray

## Frontend Configuration

Add to your frontend `.env` file:
```
VITE_API_URL=http://localhost:3001
```

For production, update this to your deployed backend URL.

