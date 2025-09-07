export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "local" | "google" | "github";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface OAuth2Provider {
  name: "google" | "github";
  displayName: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}
