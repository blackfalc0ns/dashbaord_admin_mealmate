export interface AdminLoginRequest {
  identifier: string;
  password: string;
  rememberSession: boolean;
}

export interface AdminLoginResponse {
  accessToken: string;
  expiresAt: string;
  role: 'super_admin' | 'country_admin';
}

export type LoginViewState = 'idle' | 'submitting' | 'error';
