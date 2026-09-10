// data/services.ts

import {
  Car,
  Flame,
  Users,
  HeartPulse,
  Building2,
  Home,
  Scale,
  Briefcase,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  gradient: string;
  accent: string;
}

export const SERVICES: Service[] = [
  {
    id: 'motor',
    slug: 'motor-insurance',
    title: 'Motor Insurance',
    shortDescription: 'Comprehensive and third-party cover for your vehicles',
    description:
      'Protect your vehicle with flexible motor insurance policies. Whether it is a personal car, commercial vehicle, or fleet, we provide coverage tailored to your needs.',
    icon: Car,
    features: [
      'Comprehensive and third-party cover',
      'Fleet insurance for businesses',
      '24/7 roadside assistance',
      'Fast claims settlement',
    ],
    gradient: 'from-blue-500 to-blue-700',
    accent: 'text-blue-600',
  },
  {
    id: 'fire',
    slug: 'fire-and-perils',
    title: 'Fire & Perils',
    shortDescription: 'Protection against fire, lightning, and natural disasters',
    description:
      'Safeguard your property against fire, lightning, explosions, storms, floods, and other perils that could damage your home or business.',
    icon: Flame,
    features: [
      'Fire and lightning cover',
      'Storm, flood, and earthquake cover',
      'Business interruption protection',
      'Reinstatement of damaged property',
    ],
    gradient: 'from-red-500 to-orange-600',
    accent: 'text-red-600',
  },
  {
    id: 'group-life',
    slug: 'group-life-personal-accident',
    title: 'Group Life & Personal Accident',
    shortDescription: 'Protection for employees and their families',
    description:
      'Provide financial security for your employees with group life and personal accident insurance. Demonstrate your commitment to employee welfare.',
    icon: Users,
    features: [
      'Group life insurance',
      'Personal accident cover',
      '24-hour worldwide protection',
      'Flexible benefit structures',
    ],
    gradient: 'from-purple-500 to-pink-600',
    accent: 'text-purple-600',
  },
  {
    id: 'medical',
    slug: 'medical-insurance',
    title: 'Medical Insurance',
    shortDescription: 'Complete health coverage for you and your family',
    description:
      'Access quality healthcare without financial stress. Our medical insurance covers inpatient, outpatient, maternity, and specialized treatments.',
    icon: HeartPulse,
    features: [
      'Inpatient and outpatient cover',
      'Maternity and child health',
      'Dental and optical cover',
      'Access to top hospitals',
    ],
    gradient: 'from-green-500 to-teal-600',
    accent: 'text-green-600',
  },
  {
    id: 'business-interruption',
    slug: 'business-interruption',
    title: 'Business Interruption',
    shortDescription: 'Keep your business running during disruptions',
    description:
      'Protect your revenue and operations against unexpected disruptions. Our cover ensures your business survives and recovers from events that halt operations.',
    icon: Building2,
    features: [
      'Loss of profits cover',
      'Employee wages protection',
      'Fixed costs during downtime',
      'Supply chain disruption cover',
    ],
    gradient: 'from-amber-500 to-yellow-600',
    accent: 'text-amber-600',
  },
  {
    id: 'domestic',
    slug: 'domestic-packages',
    title: 'Domestic Packages',
    shortDescription: 'Complete home and property protection',
    description:
      'Protect your home, belongings, and family with our comprehensive domestic packages combining multiple coverages for complete peace of mind.',
    icon: Home,
    features: [
      'Buildings and contents cover',
      'Personal liability protection',
      'Valuables and portable items',
      'Family legal protection',
    ],
    gradient: 'from-indigo-500 to-purple-600',
    accent: 'text-indigo-600',
  },
  {
    id: 'liability',
    slug: 'public-product-liability',
    title: 'Public & Product Liability',
    shortDescription: 'Protection against third-party claims',
    description:
      'Protect your business against legal claims from third parties. Our public and product liability insurance covers injury, damage, and product issues.',
    icon: Scale,
    features: [
      'Public liability cover',
      'Product liability protection',
      'Legal defense costs',
      'Global product coverage',
    ],
    gradient: 'from-rose-500 to-red-600',
    accent: 'text-rose-600',
  },
  {
    id: 'professional-indemnity',
    slug: 'professional-indemnity',
    title: 'Professional Indemnity',
    shortDescription: 'Protection for professionals and consultants',
    description:
      'Essential protection for professionals providing advice or services. Covers legal costs and damages from professional negligence claims.',
    icon: Briefcase,
    features: [
      'Professional negligence cover',
      'Legal defense costs',
      'Disciplinary proceeding cover',
      'Contractual liability',
    ],
    gradient: 'from-cyan-500 to-blue-600',
    accent: 'text-cyan-600',
  },
  {
    id: 'pension-education',
    slug: 'pension-education',
    title: 'Pension & Education',
    shortDescription: "Secure your future and your children's education",
    description:
      'Plan for a secure future with our pension and education insurance plans. Disciplined savings with excellent returns for retirement or education.',
    icon: GraduationCap,
    features: [
      'Retirement savings plans',
      'Education savings programs',
      'Tax-efficient savings',
      'Investment-linked growth',
    ],
    gradient: 'from-orange-500 to-amber-600',
    accent: 'text-orange-600',
  },
  {
    id: 'wiba',
    slug: 'work-injury-benefits',
    title: 'Work Injury Benefits (WIBA)',
    shortDescription: 'Statutory protection for your employees',
    description:
      'Comply with Kenyan law and protect your employees with WIBA insurance. Comprehensive cover for workplace injuries and occupational diseases.',
    icon: ShieldCheck,
    features: [
      'Statutory WIBA compliance',
      'Employee injury cover',
      'Occupational disease cover',
      'Disability and death benefits',
    ],
    gradient: 'from-slate-500 to-gray-700',
    accent: 'text-slate-600',
  },
];