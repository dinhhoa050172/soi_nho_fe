// types/auth.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  roleName: "Customer" | "Admin" | "Staff";
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  roleName: "Customer" | "Admin" | "Staff";
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface LogoutRequest {
  token: string;
}

export interface LoginResponse {
  userProfile: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  // success: boolean;
  // message: string;
  data?: {
    user: User;
    needVerification: boolean;
  };
  msg: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  msg: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  verifyOTP: (data: OTPVerifyRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
