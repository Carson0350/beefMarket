import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@wagnerbeef.com';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Send email verification email to user
 * @param email - User's email address
 * @param token - Verification token
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your WagnerBeef account',
      html: getVerificationEmailHTML(verificationUrl),
      text: getVerificationEmailText(verificationUrl),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * HTML template for verification email
 */
function getVerificationEmailHTML(verificationUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to WagnerBeef!</h1>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Thank you for creating an account. Please verify your email address to get started.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" 
         style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 14px; color: #3b82f6; word-break: break-all;">
      ${verificationUrl}
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This link will expire in 24 hours.
    </p>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Plain text template for verification email
 */
function getVerificationEmailText(verificationUrl: string): string {
  return `
Welcome to WagnerBeef!

Thank you for creating an account. Please verify your email address to get started.

Click the link below to verify your email:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.
  `;
}
