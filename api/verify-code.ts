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

  const { email, code, password, username, phoneNumber } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    // 1. Get code from Supabase DB
    const { data: record, error: dbError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .single();

    if (dbError || !record) {
      return res.status(400).json({ error: "No verification code found for this email" });
    }

    // 2. Check Expiry
    if (Date.now() > Number(record.expires_at)) {
      await supabaseAdmin.from("verification_codes").delete().eq("email", email);
      return res.status(400).json({ error: "Verification code expired" });
    }

    // 3. Check Code Match
    if (record.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Code is valid - Create User via Admin (bypasses email confirmation)
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          username: username,
          phone_number: phoneNumber,
        },
      });

    if (createError) {
      // Check if user already exists
      if (
        createError.message?.includes("already registered") ||
        createError.status === 422
      ) {
        console.log("User already exists, confirming email...");

        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = listData.users.find((u: any) => u.email === email);

        if (existingUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
          });
          console.log("Email confirmed for existing user");
        }

        await supabaseAdmin.from("verification_codes").delete().eq("email", email);
        return res.json({ message: "Verification successful", created: false });
      }

      console.error("Admin create error:", createError);
      return res.status(500).json({
        error: "Failed to create verified user: " + createError.message,
      });
    }

    console.log("User created:", userData.user.id);

    // Clean up code
    await supabaseAdmin.from("verification_codes").delete().eq("email", email);

    res.json({ message: "Verification successful", created: true });
  } catch (err: any) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
