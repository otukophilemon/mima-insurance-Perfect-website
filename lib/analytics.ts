// lib/analytics.ts

/**
 * Google Analytics event tracking helper.
 *
 * These functions are safe to call anywhere — they no-op on the server
 * or if GA is not loaded.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Fire a GA4 custom event.
 * Safe to call even if gtag hasn't loaded — it will silently no-op.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    // GA not loaded (dev, ad blockers) — silently skip
    return;
  }

  try {
    window.gtag('event', eventName, params);
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 GA Event: ${eventName}`, params);
    }
  } catch (err) {
    console.warn('Analytics error:', err);
  }
}

// ============================================
// CONVERSION HELPERS
// ============================================

export function trackQuoteSubmission(data: {
  insurance_type: string;
  location?: string;
}) {
  trackEvent('submit_quote', {
    insurance_type: data.insurance_type,
    location: data.location || 'unknown',
  });
}

export function trackClaimSubmission(data: {
  claim_type: string;
  estimated_value?: string;
  has_documents: boolean;
  document_count: number;
}) {
  trackEvent('submit_claim', {
    claim_type: data.claim_type,
    estimated_value: data.estimated_value || '0',
    has_documents: data.has_documents,
    document_count: data.document_count,
  });
}

export function trackContactSubmission(subject: string) {
  trackEvent('submit_contact', {
    subject: subject || 'General Inquiry',
  });
}

export function trackPaymentLogged(data: {
  method: string;
  amount: number;
}) {
  trackEvent('admin_log_payment', {
    method: data.method,
    amount: data.amount,
  });
}

export function trackQuoteConverted(data: {
  insurance_type: string;
  quote_id: number;
}) {
  trackEvent('convert_quote_to_policy', {
    insurance_type: data.insurance_type,
    quote_id: data.quote_id,
  });
}

export function trackPolicyPdfDownload(data: {
  policy_number: string;
  policy_type: string;
}) {
  trackEvent('download_policy_pdf', {
    policy_number: data.policy_number,
    policy_type: data.policy_type,
  });
}

export function trackCallClick(source: string) {
  trackEvent('click_call', { source });
}

export function trackWhatsAppClick(source: string) {
  trackEvent('click_whatsapp', { source });
}