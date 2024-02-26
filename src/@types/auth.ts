// DTO ----------------------------------------------------------------------------

export interface SignUpDto {
    email: string
    password: string
    grecaptcha: string
}

export interface VerifyEmailDto {
    code: number
}

export interface LoginDto {
    email: string
    password: string
}

// MODELS -------------------------------------------------------------------------

export interface UserWithToken {
    user: User,
    accessToken: string
}

export interface User {
    id: number,
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    access: Access,
    createdAt: string
    updatedAt: null
}

export enum Access {
    ADMIN = 'ADMIN',
    USER = 'USER'
}