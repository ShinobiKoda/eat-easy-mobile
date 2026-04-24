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

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not configured");
      return res.status(500).json({ error: "Email service not configured" });
    }

    const emailHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
  <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #111827; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">🍽️ Eat Easy</h2>
    <p style="color: #4b5563; font-size: 16px; text-align: center; margin-bottom: 32px;">Enter the following code to verify your email address.</p>
    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 32px;">
      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1f2937;">${code}</span>
    </div>
    <p style="color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.5;">
      This code will expire in 10 minutes.<br />
      If you didn't request this email, you can safely ignore it.
    </p>
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
      <span style="color: #374151; font-weight: 600; font-size: 14px;">© ${new Date().getFullYear()} Eat Easy</span>
    </div>
  </div>
</div>`.trim();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Eat Easy <auth@sir-p.tech>",
        to: [email],
        subject: `${code} is your verification code`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return res.status(500).json({ error: "Failed to send email" });
    }

    console.log(`✅ Verification code sent to ${email}`);
    res.json({ message: "Verification code sent" });
  } catch (err: any) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Failed to send verification code" });
  }
}
