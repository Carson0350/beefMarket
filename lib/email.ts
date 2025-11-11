import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'BeefStore <noreply@beefstore.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
      subject: 'Verify your BeefStore account',
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
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to BeefStore!</h1>
    
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
Welcome to BeefStore!

Thank you for creating an account. Please verify your email address to get started.

Click the link below to verify your email:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.
  `;
}

/**
 * Send inventory change notification email
 * @param params - Email parameters including bull data and inventory changes
 */
export async function sendInventoryChangeEmail({
  userEmail,
  bull,
  oldInventory,
  newInventory,
  changeType,
}: {
  userEmail: string;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
    ranch: {
      name: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  oldInventory: number;
  newInventory: number;
  changeType: 'became_available' | 'running_low' | 'sold_out' | 'restocked' | 'inventory_updated';
}): Promise<{ success: boolean; error?: string }> {
  const subject = getSubjectForChangeType(changeType, bull.name);
  const bullUrl = `${APP_URL}/bulls/${bull.slug}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject,
      html: getInventoryChangeEmailHTML({
        bull,
        bullUrl,
        oldInventory,
        newInventory,
        changeType,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending inventory change email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get email subject line based on change type
 */
function getSubjectForChangeType(
  changeType: string,
  bullName: string
): string {
  switch (changeType) {
    case 'became_available':
      return `🎉 ${bullName} is now available!`;
    case 'sold_out':
      return `⚠️ ${bullName} is sold out`;
    case 'running_low':
      return `⏰ Limited availability: ${bullName}`;
    case 'restocked':
      return `📦 ${bullName} restocked`;
    default:
      return `Inventory update: ${bullName}`;
  }
}

/**
 * HTML template for inventory change email
 */
function getInventoryChangeEmailHTML({
  bull,
  bullUrl,
  oldInventory,
  newInventory,
  changeType,
}: {
  bull: {
    name: string;
    heroImage: string;
    ranch: {
      name: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  bullUrl: string;
  oldInventory: number;
  newInventory: number;
  changeType: string;
}): string {
  const changeMessage = getChangeMessage(changeType, oldInventory, newInventory);
  const changeColor = getChangeColor(changeType);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inventory Update - ${bull.name}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Inventory Update</h1>
    
    <div style="background-color: white; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <img src="${bull.heroImage}" alt="${bull.name}" style="width: 100%; height: 250px; object-fit: cover;">
      <div style="padding: 20px;">
        <h2 style="margin: 0 0 10px 0; color: #2c3e50;">${bull.name}</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">${bull.ranch.name}</p>
      </div>
    </div>
    
    <div style="background-color: ${changeColor}15; padding: 20px; border-radius: 8px; border-left: 4px solid ${changeColor}; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: ${changeColor}; font-size: 18px;">
        ${changeMessage}
      </p>
      <div style="display: flex; align-items: center; gap: 20px; margin-top: 15px;">
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Previous</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #999; text-decoration: line-through;">
            ${oldInventory} ${oldInventory === 1 ? 'straw' : 'straws'}
          </p>
        </div>
        <div style="font-size: 24px; color: #999;">→</div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Current</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: ${changeColor};">
            ${newInventory} ${newInventory === 1 ? 'straw' : 'straws'}
          </p>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${bullUrl}" 
         style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        View Bull Details
      </a>
    </div>
    
    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
        <strong>Ranch Contact:</strong>
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">
        ${bull.ranch.name}<br>
        Email: ${bull.ranch.contactEmail}<br>
        Phone: ${bull.ranch.contactPhone}
      </p>
    </div>
    
    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
      You're receiving this because you favorited ${bull.name}.<br>
      To stop receiving notifications for this bull, visit your favorites page.
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Get change message based on change type
 */
function getChangeMessage(
  changeType: string,
  oldInventory: number,
  newInventory: number
): string {
  const diff = Math.abs(newInventory - oldInventory);
  
  switch (changeType) {
    case 'became_available':
      return '🎉 Now Available!';
    case 'sold_out':
      return '⚠️ Sold Out';
    case 'running_low':
      return '⏰ Running Low';
    case 'restocked':
      return `📦 Restocked (+${diff} straws)`;
    default:
      return newInventory > oldInventory 
        ? `Inventory Increased (+${diff})` 
        : `Inventory Decreased (-${diff})`;
  }
}

/**
 * Get color for change type
 */
function getChangeColor(changeType: string): string {
  switch (changeType) {
    case 'became_available':
    case 'restocked':
      return '#10b981'; // Green
    case 'sold_out':
      return '#ef4444'; // Red
    case 'running_low':
      return '#f59e0b'; // Orange
    default:
      return '#6b7280'; // Gray
  }
}

/**
 * Send price change notification email
 * @param params - Email parameters including bull data and price changes
 */
export async function sendPriceChangeEmail({
  userEmail,
  bull,
  oldPrice,
  newPrice,
  priceDifference,
  percentageChange,
  isDecrease,
}: {
  userEmail: string;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
    ranch: {
      name: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  oldPrice: number;
  newPrice: number;
  priceDifference: number;
  percentageChange: number;
  isDecrease: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const subject = isDecrease
    ? `💰 Price Drop: ${bull.name}`
    : `Price Update: ${bull.name}`;
  const bullUrl = `${APP_URL}/bulls/${bull.slug}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject,
      html: getPriceChangeEmailHTML({
        bull,
        bullUrl,
        oldPrice,
        newPrice,
        priceDifference,
        percentageChange,
        isDecrease,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending price change email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * HTML template for price change email
 */
function getPriceChangeEmailHTML({
  bull,
  bullUrl,
  oldPrice,
  newPrice,
  priceDifference,
  percentageChange,
  isDecrease,
}: {
  bull: {
    name: string;
    heroImage: string;
    ranch: {
      name: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  bullUrl: string;
  oldPrice: number;
  newPrice: number;
  priceDifference: number;
  percentageChange: number;
  isDecrease: boolean;
}): string {
  const changeColor = isDecrease ? '#10b981' : '#6b7280'; // Green for decrease, gray for increase
  const changeIcon = isDecrease ? '💰' : '📊';
  const changeText = isDecrease ? 'Price Drop!' : 'Price Update';
  const savingsText = isDecrease
    ? `Save $${Math.abs(priceDifference).toFixed(2)} per straw`
    : `Increased by $${priceDifference.toFixed(2)} per straw`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Price Update - ${bull.name}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Price Update</h1>
    
    <div style="background-color: white; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <img src="${bull.heroImage}" alt="${bull.name}" style="width: 100%; height: 250px; object-fit: cover;">
      <div style="padding: 20px;">
        <h2 style="margin: 0 0 10px 0; color: #2c3e50;">${bull.name}</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">${bull.ranch.name}</p>
      </div>
    </div>
    
    <div style="background-color: ${changeColor}15; padding: 20px; border-radius: 8px; border-left: 4px solid ${changeColor}; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: ${changeColor}; font-size: 18px;">
        ${changeIcon} ${changeText}
      </p>
      <div style="display: flex; align-items: center; gap: 20px; margin-top: 15px;">
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Previous Price</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #999; text-decoration: line-through;">
            $${oldPrice.toFixed(2)}
          </p>
        </div>
        <div style="font-size: 24px; color: #999;">→</div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">New Price</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: ${changeColor};">
            $${newPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid ${changeColor}30;">
        <p style="margin: 0; font-size: 16px; color: ${changeColor}; font-weight: bold;">
          ${savingsText} (${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%)
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${bullUrl}" 
         style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        View Bull Details
      </a>
    </div>
    
    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
        <strong>Ranch Contact:</strong>
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">
        ${bull.ranch.name}<br>
        Email: ${bull.ranch.contactEmail}<br>
        Phone: ${bull.ranch.contactPhone}
      </p>
    </div>
    
    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
      You're receiving this because you favorited ${bull.name}.<br>
      To stop receiving notifications for this bull, visit your favorites page.
    </p>
  </div>
</body>
</html>
  `;
}
