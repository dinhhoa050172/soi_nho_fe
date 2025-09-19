import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfileResponse } from "@/types/auth";
import { apiClient } from "@/lib/api";

// Define the initial state
interface UserState {
    user: UserProfileResponse | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk<UserProfileResponse, void, { rejectValue: string }>(
    "user/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/user/user-profile");
            return response.data;
        } catch (error) {
            const typedError = error as { response?: { data?: { message?: string } }; message?: string };
            const message = typedError.response?.data?.message || "Failed to fetch user profile";
            return rejectWithValue(message);
        }
    }
);

// Create the slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch user profile";
            });
    },
});

export default userSlice.reducer;
