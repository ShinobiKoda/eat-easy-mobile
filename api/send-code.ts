import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "./_utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Generate 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    // Store code in Supabase
    const { error: dbError } = await supabaseAdmin
      .from("verification_codes")
      .upsert({ email, code, expires_at: expiresAt }, { onConflict: "email" });

    if (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to store verification code" });
    }

    // Professional email template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f6f9;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f6f6f9;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(50, 50, 77, 0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #615793 0%, #4a4a6a 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">🍽️ Eat Easy</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #32324d; font-size: 16px; line-height: 1.6;">Hi there! 👋</p>
              <p style="margin: 0 0 32px 0; color: #666687; font-size: 15px; line-height: 1.6;">You requested a verification code to complete your sign up. Enter this code to verify your email address:</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #FFB01D 0%, #FF7B2C 100%); border-radius: 12px; padding: 3px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background-color: #FFF2EA; border-radius: 10px; padding: 24px; text-align: center;">
                          <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #32324d; font-family: 'Courier New', monospace;">${code}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #ebeaf2; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0; color: #615793; font-size: 14px; font-weight: 600;">⏱️ This code expires in 10 minutes</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f6f6f9; border-radius: 0 0 16px 16px; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #8e8ea9; font-size: 13px;">Didn't request this code? You can safely ignore this email.</p>
              <p style="margin: 0; color: #a5a5ba; font-size: 12px;">© ${new Date().getFullYear()} Eat Easy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

    const API_URL = process.env.API_URL || "";
    const API_SECRET = process.env.API_SECRET || "";

    if (!API_URL || !API_SECRET) {
      console.error("❌ Missing Cloudflare Worker API Configuration");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    // Send email using Cloudflare Worker
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-secret": API_SECRET,
      },
      body: JSON.stringify({
        to: email,
        subject: "🔐 Your Verification Code - Eat Easy",
        html: emailHtml,
      }),
    });

    console.log(`Verification code sent to ${email}`);
    res.json({ message: "Verification code sent" });
  } catch (err: any) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Failed to send verification code" });
  }
}
