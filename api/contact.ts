
interface ContactRequestBody {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fullName, company, email, phone, message } =
      (req.body || {}) as ContactRequestBody;

    if (!fullName || !company || !email || !phone || !message) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const cleanName = fullName.trim();
    const cleanCompany = company.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      cleanMessage.length < 10
    ) {
      return res.status(400).json({
        message: "Please check your email and message.",
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is missing.");
      return res.status(500).json({
        message: "Email service is not configured.",
      });
    }

    const escape = escapeHtml;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ||
          "Pixtron Website <inquiry@pixtronsystems.com>",
        to: ["projects@pixtronsystems.com"],
        reply_to: cleanEmail,
        subject: `New Inquiry from ${cleanName} - ${cleanCompany}`,
        html: `
          <h2>New Website Contact Inquiry</h2>
          <p><strong>Name:</strong> ${escape(cleanName)}</p>
          <p><strong>Company:</strong> ${escape(cleanCompany)}</p>
          <p><strong>Email:</strong> ${escape(cleanEmail)}</p>
          <p><strong>Phone:</strong> ${escape(cleanPhone)}</p>
          <p><strong>Message:</strong><br>${escape(cleanMessage).replace(/\n/g, "<br>")}</p>
        `,
        text: [
          "New Website Contact Inquiry",
          `Name: ${cleanName}`,
          `Company: ${cleanCompany}`,
          `Email: ${cleanEmail}`,
          `Phone: ${cleanPhone}`,
          `Message: ${cleanMessage}`,
        ].join("\n"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend contact email error:", result);
      return res.status(502).json({
        message: "Unable to send your inquiry. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "Inquiry submitted successfully.",
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
    });
  }
}
