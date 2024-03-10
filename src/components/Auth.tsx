import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { getAuthUser, signIn, signUp, verifyEmail } from "../store/reducers/authSlice"
import { createPortal } from "react-dom"
import { Form, Formik, FormikHelpers } from "formik"
import { MdFormikField } from "./ui/MdFormikField"
import { object as yupObject, string as yupString, ref as yupRef, boolean as yupBoolean, number as YupNumber } from "yup"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import api from "../utils"
// @types
import { LoginDto, SignUpDto, VerifyEmailDto } from "../@types/auth"
import { FetchApiError } from "@russh/fetch-api"
import { MdFormikCheckbox } from "./ui/MdFormikCheckbox"
import { ReCaptchaFormikField } from "./ui/ReCaptchaFormikField"

// --------------------------------------------------------------------------------

export const Auth: FC = () => {
    const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const dialogRef = useRef<HTMLDivElement>(null)
    const emailRef = useRef<string>()
    const timerRef = useRef<number>()

    const [isActive, setIsActive] = useState(false)
    const [step, setStep] = useState<'signin' | 'signup' | 'emailVerification'>('signin')
    const [timer, setTimer] = useState(0)

    // SIGN IN ------------------------------------------------------------------------
    const signInInitialValues: LoginDto = useMemo(() => ({
        email: '',
        password: ''
    }), [])

    const handleSignIn = useCallback(async (data: LoginDto, { setErrors }: FormikHelpers<LoginDto>) => {
        try {
            await dispatch(signIn(data)).unwrap()
            dialogRef.current?.classList.remove('active')
            document.getElementById('root')?.classList.remove('blured')
            setTimeout(() => setIsActive(false), 480)
        } catch (e) {
            const err = e as FetchApiError
            err.fields && setErrors(err.fields)
        }
    }, [])

    // SIGN UP ------------------------------------------------------------------------
    type SignUpData = SignUpDto & {
        passwordConfirmation: string,
        agreement: boolean
    }

    const signUpInitialValues: SignUpData = useMemo(() => ({
        email: '',
        password: '',
        passwordConfirmation: '',
        agreement: false,
        grecaptcha: '',
    }), [])

    const signUpValidationSchema = useMemo(() => yupObject().shape({
        email: yupString()
            .email('Invalid email'.localize())
            .required('Enter your email'.localize()),
        password: yupString()
            .required('Enter your password'.localize()),
        passwordConfirmation: yupString()
            .required('Confirm your password'.localize())
            .oneOf([yupRef('password')], 'Passwords do not match'.localize()),
        agreement: yupBoolean()
            .oneOf([true], 'Agreement required'.localize()),
        grecaptcha: yupString()
            .required('Please confirm that you are not a robot 🤖'.localize()),
    }), [])

    const handleSignUp = useCallback(async ({ passwordConfirmation, agreement, ...data }: SignUpData, { setErrors }: FormikHelpers<SignUpData>) => {
        try {
            // await dispatch(signUp(data)).unwrap()
            emailRef.current = data.email
            setStep('emailVerification')
        } catch (e) {
            const err = e as FetchApiError
            err.fields && setErrors(err.fields)
        }
    }, [])

    // VERIFY EMAIL -------------------------------------------------------------------
    const emailVerificationInitialValues: VerifyEmailDto = useMemo(() => ({
        code: 0
    }), [])

    const emailVerificationValidationSchema = useMemo(() => yupObject().shape({
        code: YupNumber()
            .required()
            .test('len', 'Must be exactly 6 characters'.localize(), val => val.toString().length === 6)
    }), [])

    const handleEmailVerification = useCallback(async (data: VerifyEmailDto, { setErrors }: FormikHelpers<VerifyEmailDto>) => {
        try {
            await dispatch(verifyEmail(data)).unwrap()
        } catch (e) {
            const err = e as FetchApiError
            err.fields && setErrors(err.fields)
        }
    }, [])

    // --------------------------------------------------------------------------------

    useEffect(() => {
        FingerprintJS.load()
            .then(agent => agent.get())
            .then(result => api.setAuthHeader(result.visitorId))
            .catch(() => api.setAuthHeader())
            .finally(() =>
                dispatch(getAuthUser())
                    .unwrap()
                    .catch(() => setIsActive(true)))
    }, [])

    useEffect(() => {
        if (!isAuthenticated && !isLoading) setIsActive(true)
    }, [isAuthenticated])

    useEffect(() => {
        if (isActive)
            setTimeout(() => {
                document.getElementById('root')?.classList.add('blured')
                dialogRef.current?.classList.add('active', 'visible')
            })
        else
            timerRef.current = undefined
    }, [isActive])

    useEffect(() => {
        setTimeout(() =>
            dialogRef.current?.classList.add('visible'), 140)

        if (step === 'emailVerification') {
            setTimer(120)
            const startTime = Math.floor(Date.now() / 1000) + 120
            timerRef.current = setInterval(() => {
                if (startTime >= Math.floor(Date.now() / 1000)) {
                    setTimer(startTime - Math.floor(Date.now() / 1000))
                } else {
                    clearInterval(timerRef.current)
                    timerRef.current = undefined
                }
            }, 1000)
        } else if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = undefined
            emailRef.current = undefined
        }

        return () =>
            dialogRef.current?.classList.remove('visible')
    }, [step])

    return (
        isActive &&
        createPortal(
            <div ref={dialogRef} className={`auth-dialog surface`}>
                <md-elevation />

                {step === 'signin' &&
                    <Formik initialValues={signInInitialValues} onSubmit={handleSignIn} enableReinitialize>
                        <Form>
                            <div className="auth-dialog-title headline-small on-surface-text">
                                <md-icon class="secondary-text">login</md-icon>
                                {'Sign In'.localize()}
                            </div>

                            <div className="body-medium on-surface-variant-text">
                                {'Please sign in to access site content'.localize()}
                            </div>

                            <MdFormikField name="email" type="email" icon="mail" label={'Email'.localize()} />
                            <MdFormikField name="password" type="password" icon="password" label={'Password'.localize()} />

                            <div className="auth-dialog-actions">
                                <md-text-button type="button" onClick={() => setStep('signup')} name="auth-step-one-signup">
                                    {'Sign Up'.localize()}
                                </md-text-button>
                                <md-text-button type="submit" name="auth-step-one-signin">
                                    {'Sign In'.localize()}
                                </md-text-button>
                            </div>
                        </Form>
                    </Formik>}

                {step === 'signup' &&
                    <Formik initialValues={signUpInitialValues} onSubmit={handleSignUp} validationSchema={signUpValidationSchema} enableReinitialize>
                        <Form>
                            <div className="auth-dialog-title headline-small on-surface-text">
                                <md-icon class="secondary-text">app_registration</md-icon>
                                {'Sign Up'.localize()}
                            </div>

                            <div className="body-medium on-surface-variant-text">
                                {'An email with a confirmation code will be sent to the email address you provided during registration'.localize()}
                            </div>

                            <MdFormikField name="email" type="email" icon="mail" label={'Email'.localize()} />
                            <MdFormikField name="password" type="password" icon="password" label={'Password'.localize()} />
                            <MdFormikField name="passwordConfirmation" type="password" icon="password" label={'Password confirmation'.localize()} />

                            <MdFormikCheckbox
                                name="agreement"
                                label={'Confirm and consent to the processing of my personal data'.localize()}
                                className="body-small on-surface-variant-text"
                            />

                            <ReCaptchaFormikField name="grecaptcha" className="recaptcha-widget" />

                            <div className="auth-dialog-actions">
                                <md-text-button type="button" onClick={() => setStep('signin')}>
                                    {'Back'.localize()}
                                </md-text-button>
                                <md-text-button type="submit">
                                    {'Submit'.localize()}
                                </md-text-button>
                            </div>
                        </Form>
                    </Formik>}

                {step === 'emailVerification' &&
                    <Formik
                        initialValues={emailVerificationInitialValues}
                        onSubmit={handleEmailVerification}
                        validationSchema={emailVerificationValidationSchema}
                        enableReinitialize>
                        <Form>
                            <div className="auth-dialog-title headline-small on-surface-text">
                                <md-icon class="secondary-text">mail_lock</md-icon>
                                {'Email confirmation'.localize()}
                            </div>

                            <div className="body-medium on-surface-variant-text">
                                {'Enter the 6-digit confirmation code sent to'.localize() + ' ' + (emailRef.current ?? 'provided email'.localize())}
                            </div>

                            {timer
                                ?
                                <>
                                    <div className="body-medium on-surface-variant-text">
                                        {'Code is valid until'.localize() + ' ' + timer.toString().toHHMMSS()}
                                    </div>
                                    <MdFormikField name="code" type="number" icon="key" label={'Verification code'.localize()} />
                                </>
                                :
                                <div className="body-large on-surface-variant-text">
                                    {'Code has expired'.localize()}
                                </div>}

                            <div className="auth-dialog-actions">
                                <md-text-button type="button" onClick={() => setStep('signin')}>
                                    {'Cancel registration'.localize()}
                                </md-text-button>
                                {timer
                                    ?
                                    <md-text-button type="submit">
                                        {'Submit'.localize()}
                                    </md-text-button>
                                    :
                                    <md-text-button type="button" onClick={() => setStep('signup')} >
                                        {'Back to form'.localize()}
                                    </md-text-button>}
                            </div>
                        </Form>
                    </Formik>}

            </div>,
            document.body
        )
    )
}