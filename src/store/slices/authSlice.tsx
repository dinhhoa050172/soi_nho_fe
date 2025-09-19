// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "@/app/actions/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  User,
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  LoginResponse,
  RegisterResponse,
  OTPVerifyResponse,
  LogoutRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/types/auth";
import { AppDispatch } from "../store";
import { ApiErrorResponse } from "../type";

// Auth State Interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registerEmail: string | null; // Store email for OTP verification
  needsVerification: boolean;
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registerEmail: null,
  needsVerification: false,
};

// Async Thunks
export const loginAsync = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await AuthService.login(credentials);

    if (response) {
      const { accessToken, refreshToken, userProfile } = response;

      // Store tokens in cookies
      Cookies.set("accessToken", accessToken, { expires: 1 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
      Cookies.set("userRole", userProfile.roleName, { expires: 7 });

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(userProfile));

      toast.success("Đăng nhập thành công!");
      return response;
    } else {
      return rejectWithValue(response || "Đăng nhập thất bại");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Đăng nhập thất bại";
    return rejectWithValue(message);
  }
});

export const registerAsync = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await AuthService.register(userData);
    const { data, status } = response;

    if (status === 201) {
      toast.success(
        data.msg || "Đăng ký thành công! Vui lòng kiểm tra email."
      );
      return data;
    } else {
      return rejectWithValue(data.msg || "Đăng ký thất bại");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Đăng ký thất bại";
    return rejectWithValue(message);
  }
});

export const verifyOTPAsync = createAsyncThunk<
  OTPVerifyResponse,
  OTPVerifyRequest,
  { rejectValue: string }
>("auth/verifyOTP", async (data, { rejectWithValue }) => {
  try {
    const response = await AuthService.verifyOTP(data);

    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;

      // Store tokens in cookies
      Cookies.set("accessToken", accessToken, { expires: 1 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

      toast.success("Xác thực thành công!");
      return response;
    } else {
      return rejectWithValue(response.message || "Xác thực thất bại");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Xác thực thất bại";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const veryfiEmailAsync = createAsyncThunk<
    VerifyEmailResponse,
    VerifyEmailRequest,
  { rejectValue: string }
>("auth/verify-email", async (token, { rejectWithValue }) => {
  try {
    const response = await AuthService.verifyEmail(token.token);
    const { data, status } = response;

    if (status === 200) {
      toast.success(data.msg || "Xác thực email thành công!");
      return data;
    } else {
      return rejectWithValue(data.msg || "Xác thực email thất bại");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.response?.data?.message || "Xác thực email thất bại";
    return rejectWithValue(message);
  }
});

export const getProfileAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await AuthService.getProfile();

    if (response.success) {
      return response.data;
    } else {
      return rejectWithValue("Không thể lấy thông tin profile");
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Không thể lấy thông tin profile";
    return rejectWithValue(message);
  }
});

export const resendOTPAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("auth/resendOTP", async (email, { rejectWithValue }) => {
  try {
    const response = await AuthService.resendOTP(email);

    if (response.success) {
      toast.success(response.message || "Đã gửi lại mã OTP");
      return response.message;
    } else {
      return rejectWithValue(response.message || "Không thể gửi lại OTP");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.response?.data?.message || "Không thể gửi lại OTP";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const logoutAsync = createAsyncThunk<
  void,
  LogoutRequest,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "auth/logout",
  async (token, { rejectWithValue, dispatch }) => {
    try {
      await AuthService.logout(token);
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      const err = error as { response?: { data?: ApiErrorResponse } };

      const message =
        err?.response?.data?.message ??
        err?.response?.data?.subErrors?.[0] ??
        "Đăng xuất thất bại";

      return rejectWithValue(message);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("userRole");

      dispatch(clearAuth());
    }
  }
);


// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.registerEmail = null;
      state.needsVerification = false;
      state.error = null;
    },
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerEmail = action.payload;
    },
    setNeedsVerification: (state, action: PayloadAction<boolean>) => {
      state.needsVerification = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.userProfile) {
          state.user = action.payload.userProfile;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.registerEmail = action.payload.data.user.email;
          state.needsVerification =
            action.payload.data.needVerification || false;
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Đăng ký thất bại";
      });

    // Verify OTP
    builder
      .addCase(verifyOTPAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTPAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.needsVerification = false;
          state.registerEmail = null;
        }
      })
      .addCase(verifyOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Xác thực thất bại";
      });

    // Get Profile
    builder
      .addCase(getProfileAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Không thể lấy thông tin profile";
        // Clear auth if profile fetch fails (token might be invalid)
        state.user = null;
        state.isAuthenticated = false;
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      });

    // Resend OTP
    builder
      .addCase(resendOTPAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOTPAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Không thể gửi lại OTP";
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.registerEmail = null;
        state.needsVerification = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;
        // Still clear auth state even if logout API fails
        state.user = null;
        state.isAuthenticated = false;
        state.registerEmail = null;
        state.needsVerification = false;
      });
  },
});

// Export actions
export const {
  clearError,
  setUser,
  clearAuth,
  setRegisterEmail,
  setNeedsVerification,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
