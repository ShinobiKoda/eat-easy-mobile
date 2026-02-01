import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the most recent OTP for this email
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('otp_verifications')
      .select('code')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (otpError || !otpData) {
      throw new Error('No OTP found for this email')
    }

    const code = otpData.code

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sir-P Support <auth@sir-p.tech>',
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
                <span style="color: #374151; font-weight: 600; font-size: 14px;">Sir-P.tech</span>
              </div>
            </div>
          </div>
        `,
      })
    })

    return new Response(JSON.stringify({ message: "Sent" }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})