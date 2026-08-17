export interface Customer {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  favoriteRainbowColor: string;
  notes?: string | null;
  createdAt: Date;
}

export interface CustomerInput {
  fullName: string;
  cpf: string;
  email: string;
  favoriteRainbowColor: string;
  notes?: string | null;
  // Bot Prevention Layer 1: Honeypot trap
  website_url?: string;
  // Bot Prevention Layer 2: Math CAPTCHA
  captchaToken?: string;
  captchaAnswer?: string | number;
}

export interface CustomerResponse {
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

/**
 * Standard Rainbow Colors recognized by the system.
 * Configured flexibly to allow future additions or color palette expansions.
 */
export const RAINBOW_COLORS = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Indigo',
  'Violet',
  'Vermelho',
  'Laranja',
  'Amarelo',
  'Verde',
  'Azul',
  'Anil',
  'Índigo',
  'Violeta'
] as const;
