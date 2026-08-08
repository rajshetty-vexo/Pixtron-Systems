import dotenv from "dotenv";
import path from "path";

// ── FORCE LOAD .env FILE ──
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Correct global process interface expansion
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY?: string;
      CONTACT_FROM_EMAIL?: string;
      CONTACT_TO_EMAIL?: string;
    }
  }
}

const json = (res: any, status: number, payload: Record<string, unknown>) => {
  res.status(status).json(payload);
};

// ── SANITIZATION HELPER ──
const sanitize = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── SERVER-SIDE IN-MEMORY RATE LIMITER (1 Request per 60 Seconds per IP) ──
const rateLimitMap = new Map<string, number>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const lastTime = rateLimitMap.get(ip);
  if (lastTime && now - lastTime < 60000) {
    return true;
  }
  rateLimitMap.set(ip, now);
  return false;
};

const PIXTRON_LOGO_URL = "https://res.cloudinary.com/owsr7mjw/image/upload/v1786017610/pixtron_logo_phg8ur.jpg";

const sendViaResend = async ({
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${errorText}`);
  }
};

const buildUserEmailHtml = ({
  customerName,
  productName,
  brochureUrl,
}: {
  customerName: string;
  productName: string;
  brochureUrl: string;
}) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <!-- Main Container with Grid Background & Rounded Chevrons Pattern -->
          <table width="100%" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);background-image: linear-gradient(to right, #eef2f7 1px, transparent 1px), linear-gradient(to bottom, #eef2f7 1px, transparent 1px); background-size: 24px 24px;">

            <!-- Header Section with Logo, Divider & Tagline -->
            <tr>
              <td style="padding:28px 28px 20px 28px; position:relative;">
                
                <!-- Top Right Decorative Exact Pixtron Arrow Accents -->
                <div style="float:right; clear:both; margin-top:-10px; margin-right:-10px;">
                  <svg viewBox="860 40 190 180" width="75" height="75" aria-hidden="true" style="display:inline-block;">
                    <!-- Yellow Arrow (Opacity Applied for Tint) -->
                    <path
                      fill="#fbbb0d"
                      fill-opacity="0.85"
                      d="M 981.265625 101.882812 L 889.097656 97.789062 C 871.296875 96.996094 868.289062 131.675781 889.382812 132.246094 L 946.734375 133.800781 L 942.351562 191.507812 C 941.019531 209.082031 975.289062 210.9375 976.269531 193.078125 Z M 981.265625 101.882812"
                    />
                    <!-- Blue Arrow Tint -->
                    <path
                      fill="#6C8EBF"
                      fill-opacity="0.9"
                      d="M 1035.816406 51.464844 L 943.652344 47.367188 C 925.847656 46.574219 922.84375 81.253906 943.933594 81.824219 L 1001.285156 83.378906 L 996.90625 141.085938 C 995.570312 158.660156 1029.84375 160.515625 1030.824219 142.65625 Z M 1035.816406 51.464844"
                    />
                  </svg>
                </div>

                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle; padding-right:16px;">
                      <img src="${PIXTRON_LOGO_URL}" alt="Pixtron Systems" style="height:46px;display:block;" />
                    </td>
                    <td style="border-left:3px solid #fbbb0d; padding-left:16px; vertical-align:middle;">
                      <div style="font-size:15px; font-weight:bold; color:#002b66; line-height:1.2;">Intelligence</div>
                      <div style="font-size:14px; font-style:italic; font-weight:600; color:#003985; line-height:1.2;">In Every Frame.</div>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Yellow Top Divider Line -->
            <tr>
              <td style="background-color:#fbbb0d;height:4px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Body Section -->
            <tr>
              <td style="padding:32px 28px 24px;color:#333333; position:relative;">

                <!-- Mid Left Exact Pixtron Arrow Graphic Accent -->
                <div style="position:absolute; left:-18px; top:65px;">
                  <svg viewBox="860 40 190 180" width="47" height="47" aria-hidden="true" style="display:inline-block;">
                    <path
                      fill="#fbbb0d"
                      fill-opacity="0.8"
                      d="M 981.265625 101.882812 L 889.097656 97.789062 C 871.296875 96.996094 868.289062 131.675781 889.382812 132.246094 L 946.734375 133.800781 L 942.351562 191.507812 C 941.019531 209.082031 975.289062 210.9375 976.269531 193.078125 Z M 981.265625 101.882812"
                    />
                    <path
                      fill="#6C8EBF"
                      fill-opacity="0.5"
                      d="M 1035.816406 51.464844 L 943.652344 47.367188 C 925.847656 46.574219 922.84375 81.253906 943.933594 81.824219 L 1001.285156 83.378906 L 996.90625 141.085938 C 995.570312 158.660156 1029.84375 160.515625 1030.824219 142.65625 Z M 1035.816406 51.464844"
                    />
                  </svg>
                </div>

                <p style="font-size:16px;line-height:1.6;margin:0 0 8px 0;">
                  Dear <strong>${customerName}</strong>,
                </p>
                <p style="font-size:15px;line-height:1.6;margin:0 0 24px 0;color:#444444;">
                  Thank you for connecting with <strong style="color:#003985;">Pixtron Systems</strong>.<br/>
                  Your requested brochure for <strong style="color:#003985;">${productName}</strong> is ready below.
                </p>

                <!-- Product Brochure Button Card -->
                <div style="background-color:#fbbb0d; border:1px solid #e2e8f0; border-radius:8px; padding:20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                  <p style="font-size:12px;font-weight:700;color:#003985;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.8px;">
                    📄 ${productName} Brochure
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color:#003985;border-radius:6px;">
                        <a href="${brochureUrl}" target="_blank"
                          style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.5px; border-radius:6px;">
                          ↓ Download ${productName} Brochure
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>

                <hr style="border:none;border-top:1px solid #ffffff;margin:24px 0;" />

                <!-- Contact Info Table -->
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size:13px;color:#444444;line-height:2;">
                      <strong style="color:#003985; font-size:14px;">For more enquiries:</strong><br/>
                      📞 <a href="tel:+919146707884" style="color:#003985;text-decoration:none;font-weight:600;">+91 9146707884</a><br/>
                      ✉️ <a href="mailto:projects@pixtronsystems.com" style="color:#003985;text-decoration:none;font-weight:600;">projects@pixtronsystems.com</a><br/>
                      🌐 <a href="https://www.pixtronsystems.com" style="color:#003985;text-decoration:none;font-weight:600;">www.pixtronsystems.com</a><br/>
                      💬 <a href="https://wa.me/919146707884" style="color:#25D366;text-decoration:none;font-weight:bold;">WhatsApp: Chat with us</a>
                    </td>
                  </tr>
                </table>
                    
                <!-- Social Media Links -->
                <div style="margin-top:25px; padding-top:15px; border-top:1px solid #ffffff;">
                  <p style="margin:0 0 10px 0; font-family:sans-serif; font-size:11px; font-weight:bold; text-transform:uppercase; color:#003985; letter-spacing:1.5px;">
                    Follow us on
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:12px;">
                        <a href="https://www.linkedin.com/in/pixtron-systems-5165aa427/"><img src="https://res.cloudinary.com/rjfewkks/image/upload/v1783518263/Linkdin_icon_wh7mxy.png" width="28" alt="LinkedIn"/></a>
                      </td>
                      <td style="padding-right:12px;">
                        <a href="https://www.instagram.com/pixtronsystems/"><img src="https://res.cloudinary.com/rjfewkks/image/upload/v1783518264/Instagram_icon_shsvje.png" width="28" alt="Instagram"/></a>
                      </td>
                      <td style="padding-right:12px;">
                        <a href="https://www.youtube.com/@PixtronSystems"><img src="https://res.cloudinary.com/rjfewkks/image/upload/v1783518264/Youtube_icon_qwpbai.png" width="28" alt="YouTube"/></a>
                      </td>
                      <td style="padding-right:12px;">
                        <a href="https://x.com/Pixtronsystems"><img src="https://res.cloudinary.com/rjfewkks/image/upload/v1783518264/X_lcon_mq54iu.jpg" width="28" alt="X"/></a>
                      </td>
                    </tr>
                  </table>
                </div>

              </td>
            </tr>

            <!-- Footer Section with Bottom Large Exact Pixtron Arrow & Address -->
            <tr>
              <td style="background-color:#002b66; padding:20px 28px; text-align:center; position:relative; overflow:hidden;">
                
                <!-- Bottom Right Large Exact Pixtron Arrow Tint Accent -->
                <div style="position:absolute; right:-20px; bottom:-30px;">
                  <svg viewBox="860 40 190 180" width="140" height="140" aria-hidden="true" style="display:inline-block;">
                    <path
                      fill="#fbbb0d"
                      fill-opacity="0.15"
                      d="M 981.265625 101.882812 L 889.097656 97.789062 C 871.296875 96.996094 868.289062 131.675781 889.382812 132.246094 L 946.734375 133.800781 L 942.351562 191.507812 C 941.019531 209.082031 975.289062 210.9375 976.269531 193.078125 Z M 981.265625 101.882812"
                    />
                    <path
                      fill="#ffffff"
                      fill-opacity="0.12"
                      d="M 1035.816406 51.464844 L 943.652344 47.367188 C 925.847656 46.574219 922.84375 81.253906 943.933594 81.824219 L 1001.285156 83.378906 L 996.90625 141.085938 C 995.570312 158.660156 1029.84375 160.515625 1030.824219 142.65625 Z M 1035.816406 51.464844"
                    />
                  </svg>
                </div>

                <p style="font-size:12px; color:#ffffff; margin:0 0 4px 0; font-weight:bold; position:relative; z-index:2;">
                  Pixtron Systems
                </p>
                <p style="font-size:11px; color:#cbd5e1; margin:0 0 8px 0; font-style:italic; position:relative; z-index:2;">
                  See Beyond Vision
                </p>
                <p style="font-size:11px; color:#94a3b8; margin:0; position:relative; z-index:2;">
                  This is an automated email from Pixtron Systems.<br/>
                  Head Office: Pune - 411038
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");

  if (req.method !== "POST") {
    return json(res, 405, { success: false, message: "Method not allowed." });
  }

  // IP extraction for server rate-limiting
  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return json(res, 429, {
      success: false,
      message: "Too many requests. Please wait a minute before trying again.",
    });
  }

  // ── SANITIZE ALL INPUTS ──
  const name        = sanitize(req.body?.name);
  const email       = req.body?.email ? String(req.body.email).trim().toLowerCase() : "";
  const phone       = sanitize(req.body?.phone);
  const company     = sanitize(req.body?.company);
  const productName = sanitize(req.body?.productName);
  const brochureUrl = req.body?.brochureUrl ? String(req.body.brochureUrl).trim() : "";
  const honeypot    = req.body?.website;

  // Honeypot silently accepted
  if (honeypot) {
    return json(res, 200, { success: true, message: "Request accepted." });
  }

  // ── SERVER VALIDATION: ALL FIELDS ARE REQUIRED ──
  if (!name || !email || !company || !phone || !productName || !brochureUrl) {
    return json(res, 422, { success: false, message: "All fields are required (Name, Email, Company, Phone)." });
  }

  if (!isValidEmail(email)) {
    return json(res, 422, { success: false, message: "Please provide a valid email address." });
  }

  if (name.length > 120 || company.length > 160 || phone.length > 30) {
    return json(res, 422, { success: false, message: "Input exceeds maximum allowed length." });
  }

try {
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "Pixtron Systems <onboarding@resend.dev>";
    
    // Testing mode safety check:
    // Unverified account pe saare emails "social.pixtronsystems@gmail.com" par hi lene padenge.
    const isProduction = process.env.NODE_ENV === "production";
    
    const targetUserEmail = isProduction 
      ? email 
      : "social.pixtronsystems@gmail.com";

    const targetTeamEmail = isProduction 
      ? (process.env.CONTACT_TO_EMAIL || "projects@pixtronsystems.com")
      : "social.pixtronsystems@gmail.com";

    // 1. Email to User
    await sendViaResend({
      from: fromAddress,
      to: targetUserEmail,
      subject: `Your ${productName} Brochure — Pixtron Systems`,
      html: buildUserEmailHtml({ customerName: name, productName, brochureUrl }),
    });

    // 2. Lead notification email to Pixtron Team
    await sendViaResend({
      from: fromAddress,
      to: targetTeamEmail,
      replyTo: email,
      subject: `New Brochure Inquiry — ${productName}`,
      text:
        `New Brochure Download Lead:\n\n` +
        `Product:      ${productName}\n` +
        `Name:         ${name}\n` +
        `Company:      ${company}\n` +
        `Email:        ${email}\n` +
        `Phone:        ${phone}\n` +
        `Brochure URL: ${brochureUrl}\n`,
    });

    return json(res, 200, { success: true, message: "Brochure sent to your email successfully." });

  } catch (error) {
    return json(res, 500, {
      success: false,
      message: error instanceof Error ? error.message : "Unable to send brochure right now.",
    });
  }
}