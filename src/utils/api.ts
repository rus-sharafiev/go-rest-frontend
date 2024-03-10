import FetchApi from "@russh/fetch-api"

// --------------------------------------------------------------------------------

export const BASE_URL: string = 'http://10.10.10.100:5555/api'

export enum ApiRoutes {
    SIGNUP = '/auth/signup',
    VERIFY_EMAIL = '/auth/signup/verify',
    SIGNIN = '/auth/login',
    LOGOUT = '/auth/logout',
    GET_AUTH_USER = '/auth/user',
    TOKEN_REFRESH = '/auth/refresh',
}

export const api = new FetchApi(BASE_URL, ApiRoutes.TOKEN_REFRESH, { convertToFormData: true })