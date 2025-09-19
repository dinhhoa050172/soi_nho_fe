// services/authService.ts
import { apiClient } from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
  //   RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  LogoutRequest,
  VerifyEmailResponse,
} from "@/types/auth";

export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  // Register
  static async register(
    userData: RegisterRequest
  ): Promise<{ data: RegisterResponse; status: number }> {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  // Verify OTP
  static async verifyOTP(data: OTPVerifyRequest): Promise<OTPVerifyResponse> {
    const response = await apiClient.post<OTPVerifyResponse>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  }

  // Resend OTP
  static async resendOTP(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/auth/resend-otp", { email });
    return response.data;
  }

  //Verify Email
  static async verifyEmail(
    token: string
  ): Promise<{ data: VerifyEmailResponse; status: number }> {
    const response = await apiClient.put<VerifyEmailResponse>(
      "/auth/verify-email",
      { token }
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  // Refresh Token
  static async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      { refreshToken }
    );
    return response.data;
  }

  // Get Profile
  static async getProfile(): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  }

  // Forgot Password
  static async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  }

  // Reset Password
  static async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  }

  // Change Password
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  }

  // Update Profile
  static async updateProfile(
    data: Partial<User>
  ): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.put("/auth/profile", data);
    return response.data;
  }

  // Logout
  static async logout(
    token: LogoutRequest
  ): Promise<{ success: true; message: "Đăng xuất thành công!" }> {
    const response = await apiClient.post("/auth/logout", token);
    return response.data;
  }
}
