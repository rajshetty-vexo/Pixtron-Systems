import nodemailer from 'nodemailer';

interface ContactRequestBody {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { fullName, company, email, phone, message } = (req.body || {}) as ContactRequestBody;

    // Strict Backend Validation (Check that ALL fields are present)
    if (!fullName || !company || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long.' });
    }

    // Configure Transport using Environment Variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send Mail Notification to Admin/Sales Team
    await transporter.sendMail({
      from: `"Pixtron Website" <${process.env.SMTP_USER}>`,
      to: 'projects@pixtronsystems.com',
      replyTo: email,
      subject: `New Inquiry from ${fullName} - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #003985; border-bottom: 2px solid #fbbb0d; padding-bottom: 8px;">
            New Website Contact Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 120px;">Full Name:</td>
              <td style="padding: 8px;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Company:</td>
              <td style="padding: 8px;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Phone:</td>
              <td style="padding: 8px;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
}