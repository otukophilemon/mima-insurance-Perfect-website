// data/company.ts

export const COMPANY = {
  name: 'MIMA Insurance Brokers',
  legalName: 'MIMA Insurance Brokers Limited',
  tagline: 'Your Trusted Insurance Partner',
  description:
    'MIMA Insurance Brokers Limited is a well-established insurance brokerage firm based in Kenya, offering comprehensive insurance and risk mitigation solutions for individuals and businesses.',
  established: 2005,
  email: 'brokers@mimainsure.com',
  whatsapp: '+254116000073',

  offices: [
    {
      city: 'Nairobi',
      address: 'Westlands, Allamano Centre, Along Waiyaki Way, 7th Floor',
      phone: '0116 000 073',
      phoneLink: '+254116000073',
      email: 'brokers@mimainsure.com',
      hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      isPrimary: true,
    },
    {
      city: 'Nakuru',
      address: 'Oginga Odinga Road, Opposite State House',
      phone: '0714 660 000',
      phoneLink: '+254714660000',
      email: 'brokers@mimainsure.com',
      hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      isPrimary: false,
    },
  ],

  social: {
    facebook: 'https://facebook.com/mimainsurance',
    twitter: 'https://twitter.com/mimainsurance',
    linkedin: 'https://linkedin.com/company/mima-insurance',
    instagram: 'https://instagram.com/mimainsurance',
  },

  stats: [
    { label: 'Years of Experience', value: '20+' },
    { label: 'Happy Clients', value: '10,000+' },
    { label: 'Insurance Products', value: '50+' },
    { label: 'Claim Settlement Rate', value: '98%' },
  ],
} as const;

export type Office = (typeof COMPANY.offices)[number];