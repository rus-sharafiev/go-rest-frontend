import FetchApi from "@russh/fetch-api"
import { string } from "yup"

// --------------------------------------------------------------------------------

export const BASE_API_URL: string = 'http://10.10.10.100:5555/api'
export const BASE_URL: string = 'http://10.10.10.100:5555'

export enum ApiRoutes {
    SIGNUP = '/auth/signup',
    VERIFY_EMAIL = '/auth/signup/verify',
    SIGNIN = '/auth/login',
    LOGOUT = '/auth/logout',
    GET_AUTH_USER = '/auth/user',
    TOKEN_REFRESH = '/auth/refresh',

    USERS = '/users/',
}

export const getLinkWithToken = (link: string) => BASE_URL + link + '?token=' + localStorage.getItem('accessToken') ?? ''

export const api = new FetchApi(BASE_API_URL, ApiRoutes.TOKEN_REFRESH, { convertToFormData: true })