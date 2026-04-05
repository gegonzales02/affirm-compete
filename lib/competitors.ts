export interface CompetitorData {
  name: string;
  color: string;
  tagline: string;
  consumer: string[];
  merchant: string[];
  differentiators: string[];
}

export const COMPETITORS: Record<string, CompetitorData> = {
  affirm: {
    name: "Affirm",
    color: "affirm",
    tagline: "Buy what you love. Pay over time. No gotchas.",
    consumer: [
      "Pay over time with no hidden fees, no late fees, ever",
      "0% APR options available on eligible purchases",
      "Choose biweekly or monthly payments that fit your budget",
      "Transparent pricing — see exactly what you'll pay before you commit",
      "No impact on credit score to check eligibility (soft check only)",
      "Affirm Debit+ card for in-store BNPL — GMV surged 187% YoY",
    ],
    merchant: [
      "70% lift in average cart sizes reported in FY2024",
      "Nearly 30% fewer abandoned carts vs other BNPL providers",
      "Full-stack pay-over-time: interest-bearing, 0% APR, and split-pay options",
      "Adaptive checkout — present the right offer for each shopper",
      "GMV grew 36% YoY to $8.6B in Q3 FY2025",
      "Travel & ticketing vertical grew nearly 40% YoY",
    ],
    differentiators: [
      "Zero late fees — only major BNPL to maintain this policy",
      "Broadest range: $50 to $30,000+ purchase amounts",
      "FCA-authorised, Consumer Duty aligned, regulatory-ready",
      "Only platform bridging BNPL simplicity + retail finance depth",
      "Bank charter application signals long-term legitimacy play",
      "Fiserv integration embeds BNPL directly into debit card infrastructure",
    ],
  },
  klarna: {
    name: "Klarna",
    color: "klarna",
    tagline: "Smoooth shopping. Pay your way.",
    consumer: [
      "Pay in 4 interest-free installments on purchases",
      "Fair Financing loans for longer-term payment options",
      "Klarna Card — debit-forward approach with 4M+ signups since July launch",
      "Klarna Plus subscription for power shoppers (100K US subscribers quickly)",
      "AI-powered shopping assistant for deal finding and price tracking",
      "Announced KlarnaUSD stablecoin for reduced consumer costs in 2026",
    ],
    merchant: [
      "Boosts conversion and basket size — merchants pay for incremental lift",
      "150,000+ merchants now offer Fair Financing (3x growth in 2 years)",
      "Performance-based fees tied to actual sales lift, not payment processing",
      "Strong appeal to younger, credit-averse demographics",
      "US GMV grew 43% YoY — fastest-growing region",
      "Revenue hit $903M in Q3 2025, up 28% YoY",
    ],
    differentiators: [
      "Building a full commerce network — not just payments",
      "AI-first company: replaced most customer service with AI",
      "Klarna Card bridges online BNPL to in-store spending",
      "Massive brand awareness and Gen Z cultural cachet",
      "Re-introduced late fees — strategic vulnerability vs Affirm",
      "Shopping app with price drop alerts, wishlists, and retailer content",
    ],
  },
  afterpay: {
    name: "Afterpay",
    color: "afterpay",
    tagline: "Shop Now. Take Now. Pay Later.",
    consumer: [
      "Pay in 4 interest-free installments, every time",
      "No credit check needed for standard Pay in 4",
      "Deep integration with Cash App (56M+ monthly active users)",
      "Strong focus on fashion, beauty, and lifestyle verticals",
      "In-store QR code payments at major retailers",
      "Omnichannel experience — seamless online to in-store",
    ],
    merchant: [
      "Access to 56M+ Cash App users as a distribution channel",
      "Closed-loop ecosystem: checkout to lending in one platform (Block/Square)",
      "Strong millennial and Gen Z consumer base for merchant acquisition",
      "Afterpay Discovery marketplace drives incremental traffic to merchants",
      "Expanding beyond retail into healthcare, education, and travel",
      "BNPL penetration growing 40% YoY through Block ecosystem",
    ],
    differentiators: [
      "Block/Square ecosystem — uniquely connects merchant POS + consumer wallet",
      "Cash App integration creates powerful closed-loop commerce",
      "Strongest brand in fashion/lifestyle BNPL",
      "No interest, no fees for on-time payments positioning",
      "Social commerce integrations with influencer partnerships",
      "Physical presence via Square merchant relationships",
    ],
  },
  paypal: {
    name: "PayPal Pay Later",
    color: "paypal",
    tagline: "Buy now, pay later with PayPal.",
    consumer: [
      "Pay in 4 interest-free installments up to $1,500",
      "Pay Monthly: $200–$10,000 with fixed monthly payments",
      "Embedded in existing PayPal wallet — no new app needed",
      "Available at millions of PayPal-accepting merchants automatically",
      "Purchase protection and dispute resolution built in",
      "Venmo Pay Later for younger demographic",
    ],
    merchant: [
      "Zero additional integration — works wherever PayPal is accepted",
      "Massive existing merchant footprint (35M+ merchants globally)",
      "PayPal handles all credit risk and fraud",
      "Conversion boost from offering flexible payments at existing checkout",
      "Venmo Pay Later extends reach to younger shoppers",
      "No separate merchant agreement needed for BNPL",
    ],
    differentiators: [
      "Ubiquity — available everywhere PayPal is already accepted",
      "Zero merchant integration friction (already installed)",
      "Trusted brand with decades of consumer payment history",
      "Dual brand strategy: PayPal (mainstream) + Venmo (Gen Z)",
      "Not a BNPL-first company — payments breadth is the moat",
      "Purchase protection gives consumers confidence other BNPL lacks",
    ],
  },
  zip: {
    name: "Zip",
    color: "zip",
    tagline: "Own the way you pay.",
    consumer: [
      "Pay in 4 interest-free installments",
      "Zip Plus for higher credit limits and longer terms",
      "Available for consumers with lower credit scores",
      "Virtual card for use at any online retailer",
      "In-store payments via app",
      "Flexible repayment scheduling",
    ],
    merchant: [
      "Attracts underserved credit segments other BNPL providers decline",
      "Higher approval rates for broader customer reach",
      "Integration with major e-commerce platforms",
      "In-store and online flexibility",
      "Growing US merchant network",
      "Commission-based model aligned with merchant success",
    ],
    differentiators: [
      "Positioned as most accessible BNPL — serves lower credit tiers",
      "Virtual card model works at non-integrated merchants",
      "Broader approval criteria than competitors",
      "Strong in Australia, growing aggressively in US",
      "Serves the 'credit-building' narrative for younger consumers",
      "Less brand premium but wider accessibility",
    ],
  },
  sezzle: {
    name: "Sezzle",
    color: "sezzle",
    tagline: "Buy now, pay later. Financially empower the next generation.",
    consumer: [
      "Pay in 4 interest-free installments over 6 weeks",
      "Sezzle Up credit-building program reports to credit bureaus",
      "Flexible rescheduling — reschedule one payment for free",
      "Focus on financial empowerment and credit building for Gen Z",
      "Virtual card for shopping at non-partnered stores",
      "Returning focus to subscription model (Sezzle Premium)",
    ],
    merchant: [
      "Strong in mid-market and DTC brands",
      "Higher conversion for merchants targeting Gen Z shoppers",
      "Subscription model provides predictable revenue",
      "White-label checkout integration",
      "Focus on underserved small-to-mid merchants",
      "Growing niche in gaming, wellness, and lifestyle",
    ],
    differentiators: [
      "Credit-building angle — Sezzle Up reports to bureaus",
      "Payment rescheduling flexibility (unique feature)",
      "Financial empowerment mission resonates with Gen Z",
      "Subscription-first business model pivot",
      "Niche strength in DTC / mid-market brands",
      "Smallest of the major BNPL players — but growing in specific verticals",
    ],
  },
};

export const COMPETITOR_KEYS = Object.keys(COMPETITORS).filter(
  (k) => k !== "affirm"
);

export const AUDIENCES = [
  "Enterprise Merchants (>$100M revenue)",
  "Mid-Market DTC Brands",
  "Gen Z Consumers (18-25)",
  "Millennial Consumers (26-40)",
  "Travel & Experiences Shoppers",
  "High-Ticket Purchase Shoppers ($1,000+)",
  "Credit-Underserved Consumers",
  "Fashion & Lifestyle Shoppers",
];

export const SAVED_ANALYSES = [
  { date: "Mar 28, 2026", title: "vs Klarna — Enterprise Merchant messaging gaps", type: "overlap" },
  { date: "Mar 24, 2026", title: "Sharpened: our Gen Z positioning vs PayPal", type: "sharpen" },
  { date: "Mar 19, 2026", title: "Weekly Pulse — Klarna late fees opportunity", type: "pulse" },
  { date: "Mar 14, 2026", title: "vs Afterpay — Fashion/Lifestyle whitespace", type: "overlap" },
  { date: "Mar 10, 2026", title: "Sharpened: credit-underserved positioning vs Zip", type: "sharpen" },
];
