// lib/email.ts
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@mimainsure.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const MIMA_EMAIL = 'otukophilemon88@gmail.com';

// ============================================
// QUOTE EMAILS
// ============================================

export async function sendQuoteNotification(data: {
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  age?: string;
  details?: string;
}) {
  try {
    await sgMail.send({
      to: MIMA_EMAIL,
      from: FROM_EMAIL,
      subject: `New Quote Request: ${data.insurance_type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Quote Request</h1>
          </div>
          <div style="padding: 24px; background: #f9f9f9;">
            <h2 style="color: #1e3a8a; margin-top: 0;">Insurance Type: ${data.insurance_type}</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px 0;"><strong>Full Name:</strong></td><td>${data.full_name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${data.email}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Location:</strong></td><td>${data.location}</td></tr>
              ${data.age ? `<tr><td style="padding: 8px 0;"><strong>Age:</strong></td><td>${data.age}</td></tr>` : ''}
              ${data.details ? `<tr><td style="padding: 8px 0;"><strong>Details:</strong></td><td>${data.details}</td></tr>` : ''}
            </table>
            <p style="margin-top: 24px; color: #666;">Submitted via the MIMA Insurance website</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid quote notification error:', error);
    throw error;
  }
}

export async function sendQuoteAutoReply(data: {
  full_name: string;
  email: string;
  insurance_type: string;
}) {
  try {
    await sgMail.send({
      to: data.email,
      from: FROM_EMAIL,
      subject: 'Thank you for contacting MIMA Insurance',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">MIMA Insurance Brokers</h1>
            <p style="margin: 8px 0 0 0;">Your Trusted Insurance Partner</p>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${data.full_name},</p>
            <p>Thank you for requesting a quote for <strong>${data.insurance_type}</strong> from MIMA Insurance Brokers.</p>
            <p>Our team has received your request and will contact you within <strong>24 hours</strong> with a personalized quote.</p>
            <div style="background: #eff6ff; padding: 16px; border-left: 4px solid #1e3a8a; margin: 20px 0;">
              <p style="margin: 0;"><strong>What happens next?</strong></p>
              <ol style="margin: 8px 0 0 0; padding-left: 20px;">
                <li>Our broker reviews your information</li>
                <li>We compare quotes from top insurers</li>
                <li>We call or email you with the best options</li>
              </ol>
            </div>
            <p>If you have any urgent questions, please call us:</p>
            <p><strong>Nairobi:</strong> 0116 000 073<br>
            <strong>Nakuru:</strong> 0714 660 000</p>
            <p>Best regards,<br>
            <strong>MIMA Insurance Brokers Limited</strong></p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid quote auto-reply error:', error);
    throw error;
  }
}

// ============================================
// CLAIM EMAILS
// ============================================

export async function sendClaimNotification(data: {
  tracking_number: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  estimated_value: string;
  full_name: string;
  email: string;
  phone: string;
  policy_number: string;
}) {
  try {
    await sgMail.send({
      to: MIMA_EMAIL,
      from: FROM_EMAIL,
      subject: `New Claim: ${data.tracking_number} - ${data.claim_type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Claim Submitted</h1>
            <p style="margin: 8px 0 0 0;">Tracking: ${data.tracking_number}</p>
          </div>
          <div style="padding: 24px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0;"><strong>Claim Type:</strong></td><td>${data.claim_type}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Incident Date:</strong></td><td>${data.incident_date}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Estimated Value:</strong></td><td>KES ${data.estimated_value}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Full Name:</strong></td><td>${data.full_name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${data.email}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Policy Number:</strong></td><td>${data.policy_number}</td></tr>
            </table>
            <div style="background: white; padding: 16px; margin-top: 16px; border-left: 4px solid #dc2626;">
              <strong>Incident Description:</strong>
              <p style="margin: 8px 0 0 0;">${data.incident_description}</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid claim notification error:', error);
    throw error;
  }
}

export async function sendClaimAutoReply(data: {
  full_name: string;
  email: string;
  tracking_number: string;
  claim_type: string;
}) {
  try {
    await sgMail.send({
      to: data.email,
      from: FROM_EMAIL,
      subject: `Claim Received: ${data.tracking_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Claim Received</h1>
            <p style="margin: 8px 0 0 0;">Tracking: ${data.tracking_number}</p>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${data.full_name},</p>
            <p>Your <strong>${data.claim_type}</strong> claim has been received. Our claims team will review it shortly.</p>
            <div style="background: #fef2f2; padding: 16px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your Tracking Number:</strong></p>
              <p style="margin: 8px 0 0 0; font-size: 20px; font-family: monospace;">${data.tracking_number}</p>
            </div>
            <p><strong>What happens next?</strong></p>
            <ol>
              <li><strong>Acknowledgment:</strong> Within 2 hours via email & SMS</li>
              <li><strong>Review:</strong> Within 24 hours</li>
              <li><strong>Settlement:</strong> Within 3-5 working days after approval</li>
            </ol>
            <p>Questions? Call us:</p>
            <p><strong>Nairobi:</strong> 0116 000 073<br>
            <strong>Nakuru:</strong> 0714 660 000</p>
            <p>Best regards,<br>
            <strong>MIMA Insurance Brokers Limited</strong></p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid claim auto-reply error:', error);
    throw error;
  }
}

// ============================================
// CONTACT EMAILS
// ============================================

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    await sgMail.send({
      to: MIMA_EMAIL,
      from: FROM_EMAIL,
      subject: `Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Contact Message</h1>
          </div>
          <div style="padding: 24px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${data.name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${data.email}</td></tr>
              ${data.phone ? `<tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ''}
              <tr><td style="padding: 8px 0;"><strong>Subject:</strong></td><td>${data.subject}</td></tr>
            </table>
            <div style="background: white; padding: 16px; margin-top: 16px; border-left: 4px solid #1e3a8a;">
              <strong>Message:</strong>
              <p style="margin: 8px 0 0 0;">${data.message}</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid contact notification error:', error);
    throw error;
  }
}

export async function sendContactAutoReply(data: {
  name: string;
  email: string;
  subject: string;
}) {
  try {
    await sgMail.send({
      to: data.email,
      from: FROM_EMAIL,
      subject: 'Thank you for contacting MIMA Insurance',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">MIMA Insurance Brokers</h1>
          </div>
          <div style="padding: 24px;">
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting MIMA Insurance Brokers regarding <strong>${data.subject}</strong>.</p>
            <p>Our team has received your message and will respond within <strong>24 hours</strong>.</p>
            <p>If you need immediate assistance, please call us:</p>
            <p><strong>Nairobi:</strong> 0116 000 073<br>
            <strong>Nakuru:</strong> 0714 660 000</p>
            <p>Best regards,<br>
            <strong>MIMA Insurance Brokers Limited</strong></p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('SendGrid contact auto-reply error:', error);
    throw error;
  }
}