export interface ServerPlan {
  id: string;
  duration: string;
  price: string;
  description: string;
  order: number;
}

export interface ServerAccessConfig {
  hero: {
    title: string;
    subtitle: string;
  };
  serverDetails: {
    name: string;
    version: string;
    landscape: string;
    accessType: string;
    availability: string;
    status: string;
    description: string;
  };
  indianPricing: ServerPlan[];
  internationalPricing: ServerPlan[];
  paymentDetails: {
    upiId: string;
    accountName: string;
    phoneNumber: string;
    whatsappNumber: string;
    email: string;
    instructions: string;
    activationNotes: string;
  };
  features: string[];
  faq: { question: string; answer: string; }[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    officeTiming: string;
    supportTiming: string;
  };
}

export interface ServerEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  purpose: string;
  plan: string;
  message: string;
  createdTime: string;
  status: 'New' | 'Contacted' | 'Payment Pending' | 'Payment Received' | 'Credentials Sent' | 'Completed' | 'Closed';
  notes?: string;
}

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
  order: number;
}

export interface BrandingConfig {
  logoUrl?: string;
  faviconUrl?: string;
  footerLogoUrl?: string;
  headerLogoUrl?: string;
  adminPortalLogoUrl?: string;
  studentPortalLogoUrl?: string;
  aboutMentorPhotoUrl?: string;

  primaryMobile: string;
  secondaryMobile: string;
  whatsappNumber: string;
  supportEmail: string;
  generalEmail: string;
  salesEmail: string;
  address: string;
  googleMapsLink: string;
  businessHours: string;

  socialLinks: SocialMediaLink[];
}

export const defaultBrandingConfig: BrandingConfig = {
  primaryMobile: '+91 70759 99336',
  secondaryMobile: '',
  whatsappNumber: '+91 70759 99336',
  supportEmail: 'info@srivihaanconsulting.com',
  generalEmail: 'info@srivihaanconsulting.com',
  salesEmail: '',
  address: '',
  googleMapsLink: '',
  businessHours: 'Mon-Sat 9:00 AM - 6:00 PM',
  socialLinks: [
    { id: 'fb', platform: 'Facebook', url: 'https://facebook.com', enabled: true, order: 1 },
    { id: 'ig', platform: 'Instagram', url: 'https://instagram.com', enabled: true, order: 2 },
    { id: 'li', platform: 'LinkedIn', url: 'https://linkedin.com', enabled: true, order: 3 },
  ],
};
