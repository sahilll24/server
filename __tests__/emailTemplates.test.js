import { describe, it, expect } from 'vitest';
import { createNotificationEmail, createConfirmationEmail } from '../emailTemplates.js';

describe('Email Templates', () => {
  describe('createNotificationEmail', () => {
    it('should generate HTML notification email', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'This is a test message'
      );

      expect(html).toBeDefined();
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
    });

    it('should include name in email HTML', () => {
      const html = createNotificationEmail(
        'Jane Smith',
        'jane@example.com',
        'Project Inquiry',
        'Test message'
      );

      expect(html).toContain('Jane Smith');
    });

    it('should include email in email HTML', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'Test message'
      );

      expect(html).toContain('john@example.com');
    });

    it('should include subject in email HTML', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Project Inquiry',
        'Test message'
      );

      expect(html).toContain('Project Inquiry');
    });

    it('should include message in email HTML', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'This is the message content'
      );

      expect(html).toContain('This is the message content');
    });

    it('should escape HTML special characters to prevent XSS', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      
      const html = createNotificationEmail(
        maliciousInput,
        'test@example.com',
        maliciousInput,
        maliciousInput
      );

      // Should contain escaped versions, not raw script tags
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should handle messages with newlines', () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3';
      
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        multilineMessage
      );

      // Should convert newlines to <br> tags
      expect(html).toContain('<br>');
      expect(html).toContain('Line 1');
      expect(html).toContain('Line 2');
      expect(html).toContain('Line 3');
    });

    it('should include proper HTML structure', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'Test message'
      );

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
    });

    it('should include site color scheme in CSS', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'Test message'
      );

      // Check for primary color (purple)
      expect(html).toContain('hsl(258, 89%, 66%)');
      // Check for secondary color
      expect(html).toContain('hsl(240, 5%, 33%)');
    });

    it('should include mailto link for reply', () => {
      const html = createNotificationEmail(
        'John Doe',
        'john@example.com',
        'Test Subject',
        'Test message'
      );

      expect(html).toContain('mailto:john@example.com');
    });
  });

  describe('createConfirmationEmail', () => {
    it('should generate HTML confirmation email', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      expect(html).toBeDefined();
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
    });

    it('should include name in email HTML', () => {
      const html = createConfirmationEmail('Jane Smith', 'Project Inquiry');

      expect(html).toContain('Jane Smith');
    });

    it('should include subject in email HTML', () => {
      const html = createConfirmationEmail('John Doe', 'Project Inquiry');

      expect(html).toContain('Project Inquiry');
    });

    it('should include thank you message', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      expect(html).toContain('Thank you');
      expect(html).toContain('Thank You');
    });

    it('should escape HTML special characters to prevent XSS', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      
      const html = createConfirmationEmail(maliciousInput, maliciousInput);

      // Should contain escaped versions
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should include proper HTML structure', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
    });

    it('should include site color scheme in CSS', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      // Check for primary color (purple)
      expect(html).toContain('hsl(258, 89%, 66%)');
    });

    it('should include sender name in email', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      expect(html).toContain('Sahil Saykar');
    });

    it('should include email address in footer', () => {
      const html = createConfirmationEmail('John Doe', 'Test Subject');

      expect(html).toContain('sahilsaykar24@gmail.com');
    });

    it('should handle special characters in name and subject', () => {
      const html = createConfirmationEmail(
        "John O'Brien",
        "Test's Subject & More"
      );

      // Should escape special characters
      expect(html).toContain('O&#039;Brien');
      expect(html).toContain('&amp;');
    });
  });
});

