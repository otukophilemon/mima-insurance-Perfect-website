// components/SchemaMarkup.tsx
export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: "MIMA Insurance Brokers Limited",
    alternateName: "MIMA Insurance",
    url: "https://mima-insurance-perfect-website-ashen.vercel.app",
    logo: "https://mima-insurance-perfect-website-ashen.vercel.app/images/mima-logo.png",
    description:
      "Trusted insurance brokerage offering motor, health, business, WIBA, marine, travel and life insurance across Kenya.",
    telephone: "+254116000073",
    email: "brokers@mimainsure.com",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Westlands, Allamano Centre, Along Waiyaki Way, 7th Floor",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Oginga Odinga Road, Opposite State House",
        addressLocality: "Nakuru",
        addressCountry: "KE",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    priceRange: "KES",
    sameAs: [
      "https://facebook.com/mimainsurance",
      "https://twitter.com/mimainsurance",
      "https://linkedin.com/company/mima-insurance",
      "https://instagram.com/mimainsurance",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}