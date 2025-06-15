
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  name: string;
  entityType: 'venue' | 'service_provider';
  entityName: string;
  verificationToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, entityType, entityName, verificationToken }: VerificationEmailRequest = await req.json();

    const verificationUrl = `${Deno.env.get("SITE_URL")}/verify?token=${verificationToken}`;
    const entityTypeLabel = entityType === 'venue' ? 'Venue' : 'Service Provider';

    const emailResponse = await resend.emails.send({
      from: "Vendoor <onboarding@resend.dev>",
      to: [email],
      subject: `Verify Your ${entityTypeLabel} Listing - ${entityName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Vendoor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Event Venue & Service Platform</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your ${entityTypeLabel} Listing</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${name},
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for submitting your ${entityTypeLabel.toLowerCase()} listing "<strong>${entityName}</strong>" to Vendoor. 
              To ensure the security and quality of our platform, we require all listings to be verified.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">Verification Process:</h3>
              <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Click the verification button below to confirm your email</li>
                <li>Our team will review your listing for accuracy and compliance</li>
                <li>You'll receive a confirmation email once approved</li>
                <li>Your listing will then be visible to potential clients</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #7c3aed, #2563eb); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Verify Your ${entityTypeLabel} Listing
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                <strong>Security Notice:</strong> This verification helps us maintain a safe and trustworthy platform for all users.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                If you didn't create this listing, please ignore this email or contact our support team.
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 Vendoor. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
