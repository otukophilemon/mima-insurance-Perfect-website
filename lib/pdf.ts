// lib/pdf.ts
import PDFDocument from 'pdfkit';

interface PolicyData {
  policy_number: string;
  policy_type: string;
  coverage_description: string;
  annual_premium: number;
  start_date: string;
  expiry_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface ClientData {
  full_name: string;
  email: string;
  phone: string | null;
}

interface PolicyPdfOptions {
  policy: PolicyData;
  client: ClientData;
}

/**
 * Generate a professional MIMA policy certificate PDF.
 * Returns a Buffer that can be streamed or saved.
 */
export async function generatePolicyPdf(
  options: PolicyPdfOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const { policy, client } = options;

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Policy Certificate - ${policy.policy_number}`,
          Author: 'MIMA Insurance Brokers Limited',
          Subject: `${policy.policy_type} Insurance Policy`,
          Creator: 'MIMA Insurance Brokers',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ─── Color palette ───────────────────────────────────────
      const NAVY = '#0f172a';
      const RED = '#dc2626';
      const LIGHT_GRAY = '#f3f4f6';
      const DARK_GRAY = '#374151';
      const TEXT_GRAY = '#6b7280';

      // ─── Header banner ───────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 120).fill(NAVY);

      // MIMA brand block
      doc
        .fillColor('#ffffff')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('MIMA', 50, 40);

      doc
        .fontSize(14)
        .font('Helvetica')
        .text('INSURANCE BROKERS LIMITED', 50, 75);

      doc
        .fontSize(9)
        .fillColor('#cbd5e1')
        .text(
          'Nairobi · Nakuru · Kenya  |  0116 000 073  |  0714 660 000',
          50,
          95
        );

      // "POLICY CERTIFICATE" label on the right
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('POLICY CERTIFICATE', 350, 50, {
          width: 200,
          align: 'right',
        });

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#cbd5e1')
        .text('Official Document', 350, 68, {
          width: 200,
          align: 'right',
        });

      // ─── Reset cursor below header ───────────────────────────
      doc.y = 150;
      doc.x = 50;

      // ─── Policy number + type (highlight block) ──────────────
      const blockY = doc.y;
      doc
        .rect(50, blockY, doc.page.width - 100, 80)
        .fill(LIGHT_GRAY);

      doc
        .fillColor(NAVY)
        .fontSize(9)
        .font('Helvetica')
        .text('POLICY NUMBER', 65, blockY + 12);

      doc
        .fillColor(NAVY)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(policy.policy_number, 65, blockY + 28);

      doc
        .fillColor(NAVY)
        .fontSize(9)
        .font('Helvetica')
        .text('POLICY TYPE', 340, blockY + 12);

      doc
        .fillColor(RED)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(
          `${policy.policy_type.charAt(0).toUpperCase() + policy.policy_type.slice(1)} Insurance`,
          340,
          blockY + 28
        );

      doc.y = blockY + 100;

      // ─── Status badge ────────────────────────────────────────
      const statusY = doc.y;
      const statusLabel = policy.status.toUpperCase();
      const statusColor =
        policy.status === 'active'
          ? '#16a34a'
          : policy.status === 'expired'
          ? RED
          : TEXT_GRAY;

      doc
        .roundedRect(50, statusY, 100, 22, 11)
        .fill(statusColor);

      doc
        .fillColor('#ffffff')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(statusLabel, 50, statusY + 6, {
          width: 100,
          align: 'center',
        });

      doc.y = statusY + 40;

      // ─── Client Information ──────────────────────────────────
      doc
        .fillColor(NAVY)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('POLICYHOLDER', 50, doc.y);

      doc.y += 6;
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .stroke();

      doc.y += 10;

      doc.fontSize(10).font('Helvetica-Bold').fillColor(DARK_GRAY);
      doc.text('Name:', 50, doc.y);
      doc.font('Helvetica').text(client.full_name, 150, doc.y);

      doc.font('Helvetica-Bold').text('Email:', 50, doc.y + 18);
      doc.font('Helvetica').text(client.email, 150, doc.y + 18);

      if (client.phone) {
        doc.font('Helvetica-Bold').text('Phone:', 50, doc.y + 36);
        doc.font('Helvetica').text(client.phone, 150, doc.y + 36);
        doc.y += 54;
      } else {
        doc.y += 36;
      }

      doc.y += 20;

      // ─── Policy Details ──────────────────────────────────────
      doc
        .fillColor(NAVY)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('POLICY DETAILS', 50, doc.y);

      doc.y += 6;
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .stroke();

      doc.y += 10;

      const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

      const formatKES = (amount: number) =>
        new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          minimumFractionDigits: 0,
        }).format(amount);

      const details: [string, string][] = [
        ['Policy Type', policy.policy_type.charAt(0).toUpperCase() + policy.policy_type.slice(1)],
        ['Start Date', formatDate(policy.start_date)],
        ['Expiry Date', formatDate(policy.expiry_date)],
        ['Annual Premium', formatKES(policy.annual_premium)],
      ];

      for (const [label, value] of details) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor(TEXT_GRAY)
          .text(label, 50, doc.y);

        doc
          .font('Helvetica-Bold')
          .fillColor(DARK_GRAY)
          .text(value, 250, doc.y);

        doc.y += 18;
      }

      doc.y += 15;

      // ─── Coverage Description ────────────────────────────────
      doc
        .fillColor(NAVY)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('COVERAGE', 50, doc.y);

      doc.y += 6;
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .stroke();

      doc.y += 10;

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(DARK_GRAY)
        .text(policy.coverage_description, 50, doc.y, {
          width: doc.page.width - 100,
          align: 'justify',
        });

      doc.y += 20;

      // ─── Notes (if any) ──────────────────────────────────────
      if (policy.notes) {
        doc
          .fillColor(NAVY)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('NOTES', 50, doc.y);

        doc.y += 6;
        doc
          .moveTo(50, doc.y)
          .lineTo(doc.page.width - 50, doc.y)
          .strokeColor('#e5e7eb')
          .lineWidth(1)
          .stroke();

        doc.y += 10;

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(DARK_GRAY)
          .text(policy.notes, 50, doc.y, {
            width: doc.page.width - 100,
          });

        doc.y += 20;
      }

      // ─── Footer ──────────────────────────────────────────────
      const footerY = doc.page.height - 100;

      doc
        .rect(0, footerY, doc.page.width, 100)
        .fill(LIGHT_GRAY);

      doc
        .fillColor(NAVY)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('MIMA INSURANCE BROKERS LIMITED', 50, footerY + 15);

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(TEXT_GRAY)
        .text(
          'This document certifies that the above-named policyholder is covered under the terms of the policy described herein.',
          50,
          footerY + 32,
          { width: doc.page.width - 100 }
        );

      doc
        .fontSize(8)
        .fillColor(TEXT_GRAY)
        .text(
          `Generated on ${new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}  |  Document ID: ${policy.policy_number}`,
          50,
          footerY + 60
        );

      doc
        .fontSize(8)
        .fillColor(TEXT_GRAY)
        .text(
          'For verification, contact 0116 000 073 or email info@mimainsure.com',
          50,
          footerY + 75
        );

      // ─── Finish ──────────────────────────────────────────────
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}