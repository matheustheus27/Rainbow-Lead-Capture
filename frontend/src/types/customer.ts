export interface CaptchaChallenge {
  equation: string;
  svg: string;
  captchaToken: string;
}

export interface CustomerFormData {
  fullName: string;
  cpf: string;
  email: string;
  favoriteRainbowColor: string;
  notes: string;
  // Bot Prevention Layer 1: Honeypot trap (must remain empty)
  website_url?: string;
  // Bot Prevention Layer 2: Math CAPTCHA
  captchaToken?: string;
  captchaAnswer?: string;
}

export interface CustomerSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    id?: number;
    fullName?: string;
    email?: string;
    cpf?: string;
    favoriteRainbowColor?: string;
  };
}

export interface CustomerRecord {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  favoriteRainbowColor: string;
  notes?: string | null;
  createdAt: string;
}

export interface ColorDistributionItem {
  color: string;
  count: number;
  percentage: number;
}

export interface AdminAnalyticsData {
  totalLeads: number;
  topColor: string | null;
  latestRegistration: string | null;
  distribution: ColorDistributionItem[];
}

export interface RainbowColorOption {
  value: string;
  label: string;
  hex: string;
  glowClass: string;
}
