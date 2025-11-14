import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'BeefStore <noreply@beefstore.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Send inquiry notification email to ranch owner with retry logic
 * @param params - Email parameters including ranch owner, bull, and inquiry data
 */
export async function sendInquiryNotification({
  ranchOwnerEmail,
  ranchOwnerName,
  ranchName,
  bull,
  inquiry,
}: {
  ranchOwnerEmail: string;
  ranchOwnerName: string;
  ranchName: string;
  bull: {
    name: string;
    slug: string;
    heroImage: string | null;
  };
  inquiry: {
    breederName: string;
    breederEmail: string;
    breederPhone: string | null;
    message: string;
    createdAt: Date;
  };
}): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const subject = `New Inquiry: ${bull.name} from ${inquiry.breederName}`;
  const bullUrl = `${APP_URL}/bulls/${bull.slug}`;
  const dashboardUrl = `${APP_URL}/dashboard/inquiries`;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  const retryDelays = [1000, 5000, 15000]; // 1s, 5s, 15s

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: ranchOwnerEmail,
        replyTo: inquiry.breederEmail,
        subject,
        html: getInquiryNotificationEmailHTML({
          ranchOwnerName,
          ranchName,
          bull,
          bullUrl,
          inquiry,
          dashboardUrl,
        }),
      });

      console.log(`✅ Inquiry notification sent successfully to ${ranchOwnerEmail}`, {
        messageId: result.data?.id,
        attempt: attempt + 1,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`❌ Failed to send inquiry notification (attempt ${attempt + 1}/${maxRetries}):`, {
        error: errorMessage,
        ranchOwnerEmail,
        bullName: bull.name,
      });

      if (isLastAttempt) {
        return {
          success: false,
          error: `Failed after ${maxRetries} attempts: ${errorMessage}`,
        };
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
    }
  }

  return {
    success: false,
    error: 'Failed to send email after all retry attempts',
  };
}

/**
 * HTML template for inquiry notification email
 */
function getInquiryNotificationEmailHTML({
  ranchOwnerName,
  ranchName,
  bull,
  bullUrl,
  inquiry,
  dashboardUrl,
}: {
  ranchOwnerName: string;
  ranchName: string;
  bull: {
    name: string;
    heroImage: string | null;
  };
  bullUrl: string;
  inquiry: {
    breederName: string;
    breederEmail: string;
    breederPhone: string | null;
    message: string;
    createdAt: Date;
  };
  dashboardUrl: string;
}): string {
  const formattedDate = new Date(inquiry.createdAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const bullImage = bull.heroImage || 'https://via.placeholder.com/600x300?text=No+Image';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry - ${bull.name}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6;">
      <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 28px;">New Inquiry Received</h1>
      <p style="color: #666; margin: 0; font-size: 14px;">${ranchName}</p>
    </div>
    
    <!-- Greeting -->
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${ranchOwnerName},
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      You have received a new inquiry about <strong>${bull.name}</strong> from a potential buyer.
    </p>
    
    <!-- Bull Information -->
    <div style="background-color: white; border-radius: 8px; overflow: hidden; margin-bottom: 30px; border: 1px solid #e5e7eb;">
      <img src="${bullImage}" alt="${bull.name}" style="width: 100%; height: 250px; object-fit: cover; display: block;">
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 22px;">${bull.name}</h2>
        <a href="${bullUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">View Bull Details →</a>
      </div>
    </div>
    
    <!-- Breeder Contact Information -->
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Breeder Contact Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;"><strong>Name:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${inquiry.breederName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td>
          <td style="padding: 8px 0;"><a href="mailto:${inquiry.breederEmail}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${inquiry.breederEmail}</a></td>
        </tr>
        ${inquiry.breederPhone ? `
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Phone:</strong></td>
          <td style="padding: 8px 0;"><a href="tel:${inquiry.breederPhone}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${inquiry.breederPhone}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <!-- Message -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
      <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px;">Message</h3>
      <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${inquiry.message}</p>
    </div>
    
    <!-- Call to Action -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${dashboardUrl}" 
         style="background-color: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
        View in Dashboard
      </a>
    </div>
    
    <!-- Quick Reply Note -->
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>💡 Quick Tip:</strong> Click "Reply" in your email client to respond directly to ${inquiry.breederName}.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #999; text-align: center;">
        Inquiry received on ${formattedDate}
      </p>
      <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
        BeefStore - Connecting Breeders with Quality Genetics
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
