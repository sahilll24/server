import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';

// Mock nodemailer BEFORE importing the app
const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });

// Create a mock transporter function
const mockCreateTransport = vi.fn(() => ({
  sendMail: mockSendMail,
}));

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: (...args) => mockCreateTransport(...args),
    },
  };
});

// Mock dotenv to avoid loading .env file in tests
vi.mock("dotenv", () => ({
    default: {
      config: vi.fn()
    }
  }));

// Now import the app after mocks are set up
import { app } from '../index.js';

describe('Contact API', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Reset sendMail to return success by default
    mockSendMail.mockReset();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
    // Reset createTransport to return our mock transporter
    mockCreateTransport.mockReset();
    mockCreateTransport.mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  describe('POST /api/contact', () => {
    it('should send email successfully with valid data', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message content',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Email sent successfully!',
      });

      // Verify nodemailer was called
      expect(mockCreateTransport).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledTimes(2); // Notification + Confirmation

      // Verify notification email
      const notificationCall = mockSendMail.mock.calls[0][0];
      expect(notificationCall.to).toBeDefined();
      expect(notificationCall.subject).toContain('New Contact Form Submission');
      expect(notificationCall.replyTo).toBe('john@example.com');

      // Verify confirmation email
      const confirmationCall = mockSendMail.mock.calls[1][0];
      expect(confirmationCall.to).toBe('john@example.com');
      expect(confirmationCall.subject).toBe('Thank you for reaching out!');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'All fields are required',
      });

      // Verify nodemailer was not called
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'All fields are required',
      });
    });

    it('should return 400 if subject is missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'All fields are required',
      });
    });

    it('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'All fields are required',
      });
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid email format',
      });

      // Verify nodemailer was not called
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should return 400 for email without domain', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'invalid@',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body.error).toContain('email format');
    });

    it('should return 400 for email without @ symbol', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'invalidemail.com',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body.error).toContain('email format');
    });

    it('should return 500 on email send failure', async () => {
      // Set up mock to reject on first call
      mockSendMail.mockReset();
      mockSendMail.mockRejectedValueOnce(new Error('SMTP connection failed'));

      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Failed to send email. Please try again later.',
      });
    });

    it('should handle empty string fields as missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: '',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    it('should handle whitespace-only fields as missing', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: '   ',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    it('should include HTML in notification email', async () => {
      await request(app)
        .post('/api/contact')
        .send({
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Project Inquiry',
          message: 'Hello, I am interested in your services.',
        })
        .expect(200);

      const notificationCall = mockSendMail.mock.calls[0][0];
      expect(notificationCall.html).toContain('Jane Smith');
      expect(notificationCall.html).toContain('jane@example.com');
      expect(notificationCall.html).toContain('Project Inquiry');
      expect(notificationCall.html).toContain('Hello, I am interested in your services.');
    });

    it('should include HTML in confirmation email', async () => {
      await request(app)
        .post('/api/contact')
        .send({
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Project Inquiry',
          message: 'Test message',
        })
        .expect(200);

      const confirmationCall = mockSendMail.mock.calls[1][0];
      expect(confirmationCall.html).toContain('Jane Smith');
      expect(confirmationCall.html).toContain('Project Inquiry');
      expect(confirmationCall.html).toContain('Thank you');
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});

