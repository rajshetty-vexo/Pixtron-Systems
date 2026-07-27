import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT) || 3001;

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT || 'projects@pixtronsystems.com';
const FROM_EMAIL = process.env.CONTACT_FROM || 'Pixtron Contact <onboarding@resend.dev>';

interface ContactBody {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const submissionLog = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

function isServerRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissionLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  submissionLog.set(ip, recent);
  return recent.length >= RATE_MAX;
}

function recordSubmission(ip: string): void {
  const timestamps = submissionLog.get(ip) ?? [];
  timestamps.push(Date.now());
  submissionLog.set(ip, timestamps);
}

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, company, email, phone, message } = req.body as ContactBody;

    if (!fullName || !email || !phone || !message) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    const clientIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    if (isServerRateLimited(clientIp)) {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
      return;
    }

    const htmlBody = `
      <h2>New Contact Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${fullName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${company || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone}</td></tr>
      </table>
      <h3>Message</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      replyTo: email,
      subject: `Pixtron Inquiry from ${fullName}`,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ message: 'Failed to send email. Please try again.' });
      return;
    }

    recordSubmission(clientIp);
    res.json({ message: 'Inquiry sent successfully.' });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
