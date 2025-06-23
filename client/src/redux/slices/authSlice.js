import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

// Load initial state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) {
            return {
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        };
    }
};

export const loginUser = createAsyncThunk("/login", async(credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/login", credentials)
        // Store auth state in localStorage
        const authState = {
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
            error: null,
        };
        localStorage.setItem('authState', JSON.stringify(authState));
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Login failed" })
    }
})

export const checkAuthStatus = createAsyncThunk(
    "auth/checkStatus",
    async(_, { rejectWithValue, getState }) => {
        try {
            // Check if we have stored auth state first
            const state = getState();
            if (!state.auth.isAuthenticated && !state.auth.user) {
                // If no stored auth state, don't make API call
                console.log("No stored authentication found, skipping auth check");
                return rejectWithValue({ message: "No stored authentication" });
            }
            
            console.log("Checking authentication status...");
            const response = await axiosInstance.get("/check")
            console.log("Authentication check successful");
            return response.data
        } catch (error) {
            console.log("Authentication check failed:", error.response?.status, error.response?.data?.message);
            return rejectWithValue(error.response?.data || { message: "Authentication check failed" })
        }
    }
)

export const logoutUser = createAsyncThunk("auth/logout", async() => {
    try {
        await axiosInstance.post("/logout")
        // Clear auth state from localStorage
        localStorage.removeItem('authState')
        return null
    } catch (error) {
        // Clear localStorage even if logout request fails
        localStorage.removeItem('authState')
        return null
    }
})

const initialState = loadState()

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        // Add a reducer to clear auth state without API call
        clearAuthState: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = null
            localStorage.removeItem('authState')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.isAuthenticated = true
                state.error = null
                // Update localStorage
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                }));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Login failed"
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.isAuthenticated = true
                state.error = null
                // Update localStorage
                localStorage.setItem('authState', JSON.stringify({
                    user: action.payload.user,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                }));
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = null
                // Only clear localStorage if it's not a "no stored auth" error
                if (action.payload?.message !== "No stored authentication") {
                    localStorage.removeItem('authState')
                }
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.error = null
                // Clear localStorage
                localStorage.removeItem('authState')
            })
    },
})

export const { clearError, clearAuthState } = authSlice.actions
export default authSlice.reducer;