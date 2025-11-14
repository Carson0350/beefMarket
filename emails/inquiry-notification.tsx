import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InquiryNotificationEmailProps {
  ranchOwnerName: string;
  ranchName: string;
  bullName: string;
  bullPhotoUrl?: string;
  breederName: string;
  breederEmail: string;
  breederPhone?: string;
  message: string;
  dashboardUrl: string;
  timestamp: string;
}

export default function InquiryNotificationEmail({
  ranchOwnerName,
  ranchName,
  bullName,
  bullPhotoUrl,
  breederName,
  breederEmail,
  breederPhone,
  message,
  dashboardUrl,
  timestamp,
}: InquiryNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry about {bullName} from {breederName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Inquiry</Heading>
          
          <Text style={text}>Hi {ranchOwnerName},</Text>
          
          <Text style={text}>
            You&apos;ve received a new inquiry about <strong>{bullName}</strong> from {breederName}.
          </Text>

          {bullPhotoUrl && (
            <Section style={bullSection}>
              <Img
                src={bullPhotoUrl}
                alt={bullName}
                width="200"
                height="150"
                style={bullImage}
              />
              <Heading as="h2" style={h2}>{bullName}</Heading>
            </Section>
          )}

          <Section style={breederSection}>
            <Heading as="h3" style={h3}>Breeder Contact Information</Heading>
            <Text style={contactText}>
              <strong>Name:</strong> {breederName}<br />
              <strong>Email:</strong> {breederEmail}<br />
              {breederPhone && (
                <>
                  <strong>Phone:</strong> {breederPhone}<br />
                </>
              )}
              <strong>Received:</strong> {timestamp}
            </Text>
          </Section>

          <Section style={messageSection}>
            <Heading as="h3" style={h3}>Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={buttonSection}>
            <Button href={dashboardUrl} style={button}>
              View in Dashboard
            </Button>
          </Section>

          <Text style={footer}>
            You can reply directly to this email to respond to {breederName}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
  padding: '0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 20px',
};

const contactText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '0 20px',
};

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '16px 20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  whiteSpace: 'pre-wrap' as const,
};

const bullSection = {
  margin: '32px 0',
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const bullImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
  margin: '0 auto',
  display: 'block',
};

const breederSection = {
  margin: '24px 0',
  padding: '0 20px',
};

const messageSection = {
  margin: '24px 0',
  padding: '0 20px',
};

const buttonSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  minHeight: '44px',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  padding: '0 20px',
  textAlign: 'center' as const,
};
