import type { VercelRequest, VercelResponse } from "@vercel/node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({ message: "ok" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return res.status(500).json({ error: "Email service not configured" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Eat Easy Mobile <auth@sir-p.tech>",
        to: [email],
        subject: `${code} is your verification code`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
            <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #111827; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px;">Verify your email</h2>
              <p style="color: #4b5563; font-size: 16px; text-align: center; margin-bottom: 32px;">Enter the following code to finish creating your account.</p>
              
              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 32px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1f2937;">${code}</span>
              </div>
              
              <p style="color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.5;">
                This code will expire in 10 minutes. <br />
                If you didn't request this email, you can safely ignore it.
              </p>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                <span style="color: #374151; font-weight: 600; font-size: 14px;">Eat Easy</span>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
