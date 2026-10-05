// lib/calculators.ts

// ============================================
// MOTOR INSURANCE PREMIUM CALCULATOR
// ============================================

/**
 * Standard Kenyan motor insurance rate structure.
 * Update these values when MIMA confirms their actual rates.
 */
export const MOTOR_RATES = {
  // Base rate as % of vehicle value
  baseRate: {
    private: 0.040,     // 4.0%
    commercial: 0.045,  // 4.5%
    psv: 0.070,         // 7.0%
    motorcycle: 0.035,  // 3.5%
  },

  // Age-based loading (added to base rate)
  ageLoading: [
    { maxYears: 3, loading: 0 },      // 0-3 years: no loading
    { maxYears: 7, loading: 0.005 },  // 3-7 years: +0.5%
    { maxYears: 12, loading: 0.015 }, // 7-12 years: +1.5%
    { maxYears: 999, loading: 0.03 }, // 12+ years: +3%
  ],

  // Fixed fees (KES)
  fees: {
    stampDuty: 40,
    trainingLevy: 0.002,        // 0.2% of value
    phcf: 0.002,                // 0.2% of value (Policy Holders Compensation Fund)
    iraLevy: 0.0015,            // 0.15% of premium
  },

  // Minimum premium
  minimumPremium: 15000,

  // Optional add-ons (as % or flat)
  addons: {
    thirdPartyOnly: 7500,       // flat KES
    windscreen: 15000,          // flat KES
    excessProtector: 5000,      // flat KES
    politicalViolence: 0.0025,  // 0.25% of value
  },

  // No Claim Discount options
  ncdOptions: [
    { label: 'No NCD', value: 0 },
    { label: '1 year (10%)', value: 0.10 },
    { label: '2 years (15%)', value: 0.15 },
    { label: '3+ years (20%)', value: 0.20 },
  ],
} as const;

export interface MotorCalcInput {
  vehicleValue: number;
  vehicleAge: number;
  vehicleType: 'private' | 'commercial' | 'psv' | 'motorcycle';
  ncdPercent?: number;         // 0, 0.10, 0.15, 0.20
  includeWindscreen?: boolean;
  includeExcessProtector?: boolean;
  includePoliticalViolence?: boolean;
  thirdPartyOnly?: boolean;
}

export interface MotorCalcOutput {
  baseRate: number;
  ageLoading: number;
  effectiveRate: number;
  basePremium: number;
  ncdDiscount: number;
  addonWindscreen: number;
  addonExcessProtector: number;
  addonPoliticalViolence: number;
  premiumAfterAddons: number;
  trainingLevy: number;
  phcf: number;
  iraLevy: number;
  stampDuty: number;
  totalPremium: number;
  isBelowMinimum: boolean;
}

export function calculateMotorPremium(input: MotorCalcInput): MotorCalcOutput {
  const {
    vehicleValue,
    vehicleAge,
    vehicleType,
    ncdPercent = 0,
    includeWindscreen = false,
    includeExcessProtector = false,
    includePoliticalViolence = false,
    thirdPartyOnly = false,
  } = input;

  // Third-party-only mode: flat rate
  if (thirdPartyOnly) {
    const flat = MOTOR_RATES.addons.thirdPartyOnly;
    const iraLevy = flat * MOTOR_RATES.fees.iraLevy;
    const total = flat + iraLevy + MOTOR_RATES.fees.stampDuty;

    return {
      baseRate: 0,
      ageLoading: 0,
      effectiveRate: 0,
      basePremium: flat,
      ncdDiscount: 0,
      addonWindscreen: 0,
      addonExcessProtector: 0,
      addonPoliticalViolence: 0,
      premiumAfterAddons: flat,
      trainingLevy: 0,
      phcf: 0,
      iraLevy,
      stampDuty: MOTOR_RATES.fees.stampDuty,
      totalPremium: total,
      isBelowMinimum: false,
    };
  }

  // Comprehensive mode
  const baseRate = MOTOR_RATES.baseRate[vehicleType];

  // Age loading
  const ageTier = MOTOR_RATES.ageLoading.find((t) => vehicleAge <= t.maxYears);
  const ageLoading = ageTier?.loading ?? 0;

  const effectiveRate = baseRate + ageLoading;
  const basePremium = vehicleValue * effectiveRate;

  // NCD discount
  const ncdDiscount = basePremium * ncdPercent;
  const premiumAfterNcd = basePremium - ncdDiscount;

  // Add-ons
  const addonWindscreen = includeWindscreen ? MOTOR_RATES.addons.windscreen : 0;
  const addonExcessProtector = includeExcessProtector
    ? MOTOR_RATES.addons.excessProtector
    : 0;
  const addonPoliticalViolence = includePoliticalViolence
    ? vehicleValue * MOTOR_RATES.addons.politicalViolence
    : 0;

  const premiumAfterAddons =
    premiumAfterNcd + addonWindscreen + addonExcessProtector + addonPoliticalViolence;

  // Fixed levies
  const trainingLevy = vehicleValue * MOTOR_RATES.fees.trainingLevy;
  const phcf = vehicleValue * MOTOR_RATES.fees.phcf;
  const iraLevy = premiumAfterAddons * MOTOR_RATES.fees.iraLevy;
  const stampDuty = MOTOR_RATES.fees.stampDuty;

  let totalPremium = premiumAfterAddons + trainingLevy + phcf + iraLevy + stampDuty;
  let isBelowMinimum = false;

  if (totalPremium < MOTOR_RATES.minimumPremium) {
    totalPremium = MOTOR_RATES.minimumPremium;
    isBelowMinimum = true;
  }

  return {
    baseRate,
    ageLoading,
    effectiveRate,
    basePremium,
    ncdDiscount,
    addonWindscreen,
    addonExcessProtector,
    addonPoliticalViolence,
    premiumAfterAddons,
    trainingLevy,
    phcf,
    iraLevy,
    stampDuty,
    totalPremium,
    isBelowMinimum,
  };
}

// ============================================
// PRO-RATA CALCULATOR
// ============================================

/**
 * Calculate a pro-rata (partial-period) premium.
 * Used when a policy is cancelled or started mid-term.
 */
export function calculateProRata(
  annualPremium: number,
  monthsRemaining: number
): {
  dailyRate: number;
  proRataPremium: number;
  daysCharged: number;
  annualPremium: number;
} {
  const daysInYear = 365;
  const daysRemaining = Math.round((monthsRemaining / 12) * daysInYear);
  const dailyRate = annualPremium / daysInYear;
  const proRataPremium = dailyRate * daysRemaining;

  return {
    dailyRate,
    proRataPremium,
    daysCharged: daysRemaining,
    annualPremium,
  };
}

// ============================================
// DEPOSIT / INSTALLMENT CALCULATOR
// ============================================

/**
 * Split a total premium into a deposit + N installments.
 */
export function calculateInstallments(
  totalAmount: number,
  depositPercent: number,
  numberOfInstallments: number
): {
  deposit: number;
  remaining: number;
  installmentAmount: number;
  totalAmount: number;
} {
  const deposit = totalAmount * (depositPercent / 100);
  const remaining = totalAmount - deposit;
  const installmentAmount = numberOfInstallments > 0 ? remaining / numberOfInstallments : 0;

  return {
    deposit,
    remaining,
    installmentAmount,
    totalAmount,
  };
}

// ============================================
// FORMATTING HELPERS
// ============================================

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

// ============================================
// HEALTH INSURANCE ESTIMATOR
// ============================================

/**
 * Health insurance pricing model for Kenya.
 * Ranges are based on typical market rates from major insurers (AAR, Jubilee, 
 * Britam, Old Mutual, CIC, Madison) as of 2024-2025.
 *
 * These are RANGES, not exact quotes. Actual premium depends on:
 * - Specific insurer
 * - Pre-existing conditions
 * - Hospital tier (A/B/C)
 * - Optional benefits (dental, optical, maternity)
 */

export type HealthCoverLevel = 'inpatient' | 'comprehensive' | 'executive';
export type FamilySize = 'single' | 'couple' | 'family';

export interface HealthCalcInput {
  age: number;
  coverLevel: HealthCoverLevel;
  familySize: FamilySize;
  annualLimit?: number; // in KES, optional
}

export interface HealthCalcOutput {
  // Range for the exact combination requested
  minPremium: number;
  maxPremium: number;
  
  // Context for the calculator display
  ageBand: string;
  coverLevelLabel: string;
  familySizeLabel: string;
  annualLimit: number;
  
  // Age-band breakdown table (for educational display)
  ageBands: {
    band: string;
    minMultiplier: number;
    maxMultiplier: number;
  }[];
  
  // Notes about what's included
  inclusions: string[];
  exclusions: string[];
}

// Base price ranges by cover level for a SINGLE adult, age 25-35
// (used as baseline, all other prices are multipliers on these)
const HEALTH_BASE_RATES: Record<HealthCoverLevel, { min: number; max: number; label: string }> = {
  inpatient: {
    min: 25000,
    max: 45000,
    label: 'Inpatient Only',
  },
  comprehensive: {
    min: 55000,
    max: 95000,
    label: 'Inpatient + Outpatient',
  },
  executive: {
    min: 120000,
    max: 220000,
    label: 'Executive / Premium',
  },
};

// Family size multipliers
const FAMILY_MULTIPLIERS: Record<FamilySize, { mult: number; label: string; description: string }> = {
  single: { mult: 1.0, label: 'Single', description: '1 adult' },
  couple: { mult: 1.9, label: 'Couple', description: '2 adults' },
  family: { mult: 3.2, label: 'Family', description: '2 adults + up to 4 children' },
};

// Age band multipliers (based on actuarial risk curves)
const AGE_BANDS = [
  { band: '18-25', minAge: 18, maxAge: 25, mult: 0.85 },
  { band: '26-35', minAge: 26, maxAge: 35, mult: 1.0 },
  { band: '36-45', minAge: 36, maxAge: 45, mult: 1.35 },
  { band: '46-55', minAge: 46, maxAge: 55, mult: 1.85 },
  { band: '56-65', minAge: 56, maxAge: 65, mult: 2.65 },
  { band: '66+',   minAge: 66, maxAge: 120, mult: 3.80 },
];

export function calculateHealthPremium(input: HealthCalcInput): HealthCalcOutput {
  const { age, coverLevel, familySize } = input;

  // Find the age band
  const ageBand = AGE_BANDS.find((b) => age >= b.minAge && age <= b.maxAge) || AGE_BANDS[1];

  const base = HEALTH_BASE_RATES[coverLevel];
  const familyMult = FAMILY_MULTIPLIERS[familySize].mult;
  const ageMult = ageBand.mult;

  const minPremium = Math.round((base.min * familyMult * ageMult) / 1000) * 1000;
  const maxPremium = Math.round((base.max * familyMult * ageMult) / 1000) * 1000;

  // Estimate of the annual limit
  const annualLimit = input.annualLimit || (coverLevel === 'inpatient' ? 1000000 : coverLevel === 'comprehensive' ? 3000000 : 5000000);

  // Age band breakdown table with multipliers
  const ageBands = AGE_BANDS.map((b) => ({
    band: b.band,
    minMultiplier: base.min * familyMult * b.mult,
    maxMultiplier: base.max * familyMult * b.mult,
  }));

  // Inclusions/exclusions by cover level
  const inclusions: Record<HealthCoverLevel, string[]> = {
    inpatient: [
      'Hospital admission and bed charges',
      'Surgery and theatre fees',
      'Doctor and specialist fees',
      'Diagnostic tests and imaging',
      'Prescription drugs during admission',
      'Follow-up consultations (60-90 days)',
    ],
    comprehensive: [
      'Everything in Inpatient cover',
      'Outpatient consultations and GP visits',
      'Prescription drugs (outpatient)',
      'Diagnostic tests (outpatient)',
      'Limited dental and optical (varies)',
      'Basic maternity (after waiting period)',
    ],
    executive: [
      'Everything in Comprehensive cover',
      'Higher limits for dental and optical',
      'International treatment options',
      'Private hospital / VIP room upgrades',
      'Comprehensive maternity cover',
      'Executive wellness and screening',
      'Wellness and preventive programs',
    ],
  };

  const exclusions = [
    'Pre-existing conditions (typically excluded in year 1)',
    'Cosmetic and elective procedures',
    'Self-inflicted injuries',
    'War and terrorism-related injuries',
    'Maternity (on inpatient-only plans)',
  ];

  return {
    minPremium,
    maxPremium,
    ageBand: ageBand.band,
    coverLevelLabel: base.label,
    familySizeLabel: FAMILY_MULTIPLIERS[familySize].label,
    annualLimit,
    ageBands,
    inclusions: inclusions[coverLevel],
    exclusions,
  };
}