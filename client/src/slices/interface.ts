export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthState {
  user: {} | null;
  isAuthenticated: boolean;
  message: string;
}
