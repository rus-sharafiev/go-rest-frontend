import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { api, ApiRoutes } from "../../utils/api"
// @types
import { LoginDto, SignUpDto, User, UserWithToken, VerifyEmailDto } from "../../@types/auth"
import { FetchApiError } from "@russh/fetch-api"

// --------------------------------------------------------------------------------

export const signUp = createAsyncThunk('auth/signup', async (payloads: SignUpDto, thunkAPI) => {
    try {
        return await api.post(ApiRoutes.SIGNUP, payloads) as Promise<UserWithToken>
    } catch (e) {
        const error = e as FetchApiError
        return thunkAPI.rejectWithValue(error)
    }
})

export const verifyEmail = createAsyncThunk('auth/signup/verify', async (payloads: VerifyEmailDto, thunkAPI) => {
    try {
        return await api.post(ApiRoutes.VERIFY_EMAIL, payloads) as Promise<UserWithToken>
    } catch (e) {
        const error = e as FetchApiError
        return thunkAPI.rejectWithValue(error)
    }
})

export const signIn = createAsyncThunk('auth/signin', async (payloads: LoginDto, thunkAPI) => {
    try {
        return await api.post(ApiRoutes.SIGNIN, payloads) as Promise<UserWithToken>
    } catch (e) {
        const error = e as FetchApiError
        return thunkAPI.rejectWithValue(error)
    }
})

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        return await api.get(ApiRoutes.LOGOUT) as Promise<{ message: string }>
    } catch (e) {
        const error = e as FetchApiError
        return thunkAPI.rejectWithValue(error)
    }
})

export const getAuthUser = createAsyncThunk('auth/user', async (_, thunkAPI) => {
    try {
        return await api.get(ApiRoutes.GET_AUTH_USER) as Promise<User>
    } catch (e) {
        const error = e as FetchApiError
        return thunkAPI.rejectWithValue(error)
    }
})

// --------------------------------------------------------------------------------

const initialState: {
    user?: User,
    isAuthenticated: boolean,
    isLoading: boolean,
} = {
    isAuthenticated: false,
    isLoading: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder

            // SIGN UP ------------------------------------------------------------
            .addCase(signUp.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.isAuthenticated = true
                state.isLoading = false
                localStorage.setItem('accessToken', action.payload.accessToken)
            })
            .addCase(signUp.rejected, (state) => {
                state.user = initialState.user
                state.isAuthenticated = false
                state.isLoading = false
            })

            // SIGN IN ------------------------------------------------------------
            .addCase(signIn.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.isAuthenticated = true
                state.isLoading = false
                localStorage.setItem('accessToken', action.payload.accessToken)
            })
            .addCase(signIn.rejected, (state) => {
                state.user = initialState.user
                state.isAuthenticated = false
                state.isLoading = false
            })

            // LOG OUT ------------------------------------------------------------
            .addCase(logOut.fulfilled, (state) => {
                state.user = initialState.user
                state.isAuthenticated = false
                localStorage.removeItem('accessToken')
            })
            .addCase(logOut.rejected, (state) => {
                state.user = initialState.user
                state.isAuthenticated = false
                localStorage.removeItem('accessToken')
            })

            // GET AUTH USER ------------------------------------------------------
            .addCase(getAuthUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAuthUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(getAuthUser.rejected, (state) => {
                state.isLoading = false
                state.user = initialState.user
                state.isAuthenticated = false
            })
    },
})

export const { } = authSlice.actions

export default authSlice.reducer