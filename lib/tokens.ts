import crypto from 'crypto';
import { prisma } from '@/lib/db';

/**
 * Generate a secure random verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and store a verification token for a user
 * @param email - User's email address
 * @returns The generated token
 */
export async function createVerificationToken(email: string): Promise<string> {
  const token = generateVerificationToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verify a token and mark the user's email as verified
 * @param token - The verification token
 * @returns Object with success status and message
 */
export async function verifyEmailToken(token: string): Promise<{
  success: boolean;
  message: string;
  email?: string;
}> {
  // Find the token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return {
      success: false,
      message: 'Invalid or expired verification token',
    };
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return {
      success: false,
      message: 'Verification token has expired',
    };
  }

  // Update user's emailVerified field
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  // Delete the used token
  await prisma.verificationToken.delete({
    where: { token },
  });

  return {
    success: true,
    message: 'Email verified successfully',
    email: verificationToken.identifier,
  };
}
