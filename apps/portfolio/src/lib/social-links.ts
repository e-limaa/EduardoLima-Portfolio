// Contact and social destinations come from build-time env vars. A link whose
// variable is missing is left out instead of pointing at a generic homepage.
const configured = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && /^https:\/\//.test(trimmed) ? trimmed : undefined;
};

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");

export const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined;
export const linkedinUrl = configured(import.meta.env.VITE_LINKEDIN_URL);

export const socialLinks = [
  { label: "Github", href: configured(import.meta.env.VITE_GITHUB_URL) },
  { label: "Instagram", href: configured(import.meta.env.VITE_INSTAGRAM_URL) },
  { label: "Twitter", href: configured(import.meta.env.VITE_TWITTER_URL) },
].filter((link): link is { label: string; href: string } => Boolean(link.href));
