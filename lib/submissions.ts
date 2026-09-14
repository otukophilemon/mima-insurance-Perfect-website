// lib/submissions.ts

export interface QuoteSubmission {
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  age?: string;
  details?: string;
}

export interface ClaimSubmission {
  tracking_number: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  estimated_value: string;
  full_name: string;
  email: string;
  phone: string;
  policy_number: string;
  additional_notes?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ============================================
// Submit a Quote Request
// ============================================
export async function submitQuote(data: QuoteSubmission) {
  const response = await fetch('/api/submit-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Quote submission error:', result);
    throw new Error(result.error || 'Submission failed');
  }

  return result.data;
}

// ============================================
// Submit a Claim
// ============================================
export async function submitClaim(data: ClaimSubmission) {
  const response = await fetch('/api/submit-claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Claim submission error:', result);
    throw new Error(result.error || 'Submission failed');
  }

  return result.data;
}

// ============================================
// Submit a Contact Message
// ============================================
export async function submitContact(data: ContactSubmission) {
  const response = await fetch('/api/submit-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Contact submission error:', result);
    throw new Error(result.error || 'Submission failed');
  }

  return result.data;
}