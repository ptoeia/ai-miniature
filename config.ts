// TODO: Replace these placeholder values with actual configuration from environment variables or a secure source.
const config = {
  creem: {
    url: process.env.NEXT_PUBLIC_CREEM_API_URL || "http://localhost:3001/api", // Example placeholder
    pricingTableId: process.env.NEXT_PUBLIC_CREEM_PRICING_TABLE_ID || "default_pricing_table", // Example placeholder
  },
  // Storage configuration removed; use environment variables directly where needed.
  // APICore configuration for Flux image generation
  apicore: {
    baseUrl: process.env.APICORE_BASE_URL || "https://ismaque.org/v1",
    apiKey: process.env.APICORE_API_KEY || "",
  },
  // You can add other configuration sections here as defined in types/config.ts if needed elsewhere
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Flux Kontext Online",
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "AI Image Editing Reimagined",
  domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME || "fluxkontext.online",
  // KIE (Nano Banana) configuration
  kie: {
    baseUrl: process.env.KIE_BASE_URL || 'https://api.kie.ai',
    apiKey: process.env.KIE_API_KEY || '32cd9be94c71a153db616e420d58278d',
    model: process.env.KIE_MODEL || 'google/nano-banana',
    timeoutMs: Number(process.env.KIE_TIMEOUT_MS || 180000),
    useAsync: String(process.env.KIE_USE_ASYNC || 'true') === 'true',
    // Optional: feature flags
    enableUpload: String(process.env.KIE_ENABLE_UPLOAD || 'true') === 'true',
  },
  stripe: {
    plans: [
      // Add example plans if needed, or leave empty
    ],
  },
  email: {
    subdomain: process.env.NEXT_PUBLIC_EMAIL_SUBDOMAIN || "mail",
    fromNoReply: process.env.NEXT_PUBLIC_EMAIL_FROM_NOREPLY || "cloudhopper66@gmail.com",
    fromAdmin: process.env.NEXT_PUBLIC_EMAIL_FROM_ADMIN || "admin@fluxkontext.online",
  },
  socialLinks: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "#",
    discord: process.env.NEXT_PUBLIC_DISCORD_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  },
  contact_us_email: process.env.NEXT_PUBLIC_CONTACT_US_EMAIL || "cloudhopper66@gmail.com",
  // AI Image Generation Credit Costs - Updated to match frontend display
  creditCosts: {
    basic: 1,
    standard: 2,
    pro: 10,  // Updated to match frontend
    max: 40,  // Updated to match frontend
  },
};

export default config;
