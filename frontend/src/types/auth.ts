export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}
