import FetchApi from "@russh/fetch-api"

// --------------------------------------------------------------------------------

export const BASE_URL: string = 'http://10.10.10.100:5555'

export enum ApiRoutes {
    SIGNUP = '/api/auth/signup',
    VERIFY_EMAIL = '/api/auth/signup/verify',
    SIGNIN = '/api/auth/login',
    LOGOUT = '/api/auth/logout',
    GET_AUTH_USER = '/api/auth/user',
    TOKEN_REFRESH = '/api/auth/refresh',
}

export const api = new FetchApi(BASE_URL, ApiRoutes.TOKEN_REFRESH, { convertToFormData: true })