export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash?: string;
  role: string;
  createdAt: Date;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserSummary;
}

export interface JWTPayload {
  userId: number;
  name: string;
  email: string;
  role: string;
}
