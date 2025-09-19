// hooks/useAuthRedux.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginAsync,
  registerAsync,
  verifyOTPAsync,
  getProfileAsync,
  resendOTPAsync,
  logoutAsync,
  clearError,
  setRegisterEmail,
  veryfiEmailAsync,
} from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import {
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  LogoutRequest,
  VerifyEmailRequest,
} from "@/types/auth";

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    registerEmail,
    needsVerification,
  } = useAppSelector((state) => state.auth);

  // Initialize auth state on mount
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && !user) {
      dispatch(getProfileAsync());
    }
  }, [dispatch, user]);

  // Auth methods
  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginAsync(credentials));
    if (loginAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload as string);
    }
  };

  const register = async (userData: RegisterRequest) => {
    const result = await dispatch(registerAsync(userData));
    if (registerAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload as string);
    }
  };

  const verifyOTP = async (data: OTPVerifyRequest) => {
    const result = await dispatch(verifyOTPAsync(data));
    if (verifyOTPAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload as string);
    }
  };

  const verifyEmail = async (token: VerifyEmailRequest) => {
    const result = await dispatch(veryfiEmailAsync(token));
    if (veryfiEmailAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(
        (result.payload as unknown as { msg: string }).msg ||
          "Xác thực thất bại"
      );
    }
  };

  const resendOTP = async (email: string) => {
    const result = await dispatch(resendOTPAsync(email));
    if (resendOTPAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload as string);
    }
  };

  const logout = async (token: LogoutRequest) => {
    await dispatch(logoutAsync(token));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const setEmailForVerification = (email: string) => {
    dispatch(setRegisterEmail(email));
  };

  const refreshUserProfile = async () => {
    const result = await dispatch(getProfileAsync());
    if (getProfileAsync.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload as string);
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    registerEmail,
    needsVerification,

    // Methods
    login,
    register,
    verifyEmail,
    verifyOTP,
    resendOTP,
    logout,
    clearAuthError,
    setEmailForVerification,
    refreshUserProfile,
  };
};
