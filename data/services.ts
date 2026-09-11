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
  ShieldAlert,
  Ship,
  Plane,
  Banknote,
  PiggyBank,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  image: string;
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
    image: '/images/service-motor.jpg',
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
    image: '/images/service-fire.jpg',
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
    image: '/images/service-life.jpg',
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
    image: '/images/service-medical.jpg',
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
    image: '/images/service-business.jpg',
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
    image: '/images/service-domestic.jpg',
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
    image: '/images/service-liability.jpg',
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
    image: '/images/service-professional.jpg',
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
    id: 'pension',
    slug: 'pension-insurance',
    title: 'Pension Insurance',
    shortDescription: 'Secure your retirement with confidence',
    description:
      'Plan for a comfortable retirement with our pension insurance plans. We offer flexible savings structures, tax-efficient contributions, and investment-linked growth to help you build a secure financial future.',
    icon: PiggyBank,
    image: '/images/service-pension.jpg',
    features: [
      'Retirement savings plans',
      'Tax-efficient contributions',
      'Investment-linked growth',
      'Flexible contribution structures',
    ],
    gradient: 'from-orange-500 to-amber-600',
    accent: 'text-orange-600',
  },
  {
    id: 'education',
    slug: 'education-insurance',
    title: 'Education Insurance',
    shortDescription: "Secure your children's education",
    description:
      "Protect your children's education with our education insurance plans. Disciplined savings combined with life cover ensure their education continues no matter what happens.",
    icon: GraduationCap,
    image: '/images/service-education.jpg',
    features: [
      'Education savings programs',
      'Life cover protection',
      'Guaranteed education payouts',
      'Flexible payment plans',
    ],
    gradient: 'from-yellow-500 to-amber-600',
    accent: 'text-yellow-700',
  },
  {
    id: 'wiba',
    slug: 'work-injury-benefits',
    title: 'Work Injury Benefits (WIBA)',
    shortDescription: 'Statutory protection for your employees',
    description:
      'Comply with Kenyan law and protect your employees with WIBA insurance. Comprehensive cover for workplace injuries and occupational diseases.',
    icon: ShieldCheck,
    image: '/images/service-wiba.jpg',
    features: [
      'Statutory WIBA compliance',
      'Employee injury cover',
      'Occupational disease cover',
      'Disability and death benefits',
    ],
    gradient: 'from-slate-500 to-gray-700',
    accent: 'text-slate-600',
  },
  {
    id: 'burglary',
    slug: 'burglary-insurance',
    title: 'Burglary Insurance',
    shortDescription: 'Protection against theft and break-ins',
    description:
      'Safeguard your home or business against burglary, theft, and attempted break-ins. Our burglary insurance covers loss or damage to property and valuables from forced entry.',
    icon: ShieldAlert,
    image: '/images/service-burglary.jpg',
    features: [
      'Theft and burglary cover',
      'Damage from forced entry',
      'Valuables and cash cover',
      'Business and home protection',
    ],
    gradient: 'from-red-600 to-rose-800',
    accent: 'text-red-700',
  },
  {
    id: 'marine',
    slug: 'marine-insurance',
    title: 'Marine Insurance',
    shortDescription: 'Coverage for goods in transit and cargo',
    description:
      'Protect your goods during sea, air, and road transit. Our marine insurance covers cargo, hull, and freight against loss, damage, and liability during transportation.',
    icon: Ship,
    image: '/images/service-marine.jpg',
    features: [
      'Cargo and goods in transit',
      'Marine hull cover',
      'Freight and liability cover',
      'Import and export protection',
    ],
    gradient: 'from-blue-600 to-cyan-700',
    accent: 'text-blue-700',
  },
  {
    id: 'travel',
    slug: 'travel-insurance',
    title: 'Travel Insurance',
    shortDescription: 'Coverage for local and international travel',
    description:
      'Travel with confidence. Our travel insurance covers medical emergencies, trip cancellation, lost luggage, and personal accidents during domestic and international trips.',
    icon: Plane,
    image: '/images/service-travel.jpg',
    features: [
      'Emergency medical cover abroad',
      'Trip cancellation and delay',
      'Lost luggage and documents',
      '24/7 global assistance',
    ],
    gradient: 'from-sky-500 to-indigo-700',
    accent: 'text-sky-600',
  },
  {
    id: 'money',
    slug: 'money-insurance',
    title: 'Money Insurance',
    shortDescription: 'Protection for cash and valuables in transit',
    description:
      'Secure your cash and valuables. Our money insurance covers loss of money in transit, in safe custody, and on business premises from theft, robbery, or accidents.',
    icon: Banknote,
    image: '/images/service-money.jpg',
    features: [
      'Cash in transit cover',
      'Money in safe custody',
      'Loss from robbery or theft',
      'Business premises protection',
    ],
    gradient: 'from-emerald-500 to-green-700',
    accent: 'text-emerald-600',
  },
];