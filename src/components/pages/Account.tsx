import { useCallback, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store"
import { Form, Formik, FormikHelpers } from "formik"
import { FetchApiError } from "@russh/fetch-api"
import { MdFormikField } from "../ui/MdFormikField"
// @types
import { User } from "../../@types/auth"
import { SingleImageFormikField } from "../ui/ImageFormikFields"
import { updateAuthUser } from "../../store/reducers/authSlice"

// --------------------------------------------------------------------------------

type UserDto = Partial<User>

export const Account: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)

    const containerRef = useRef<HTMLDivElement>(null)

    const initialValues: UserDto = useMemo(() => ({
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        phone: user?.phone ?? '',
        avatar: user?.avatar ?? '',
        access: user?.access,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
    }), [user])

    const handleSubmit = useCallback(async (data: UserDto, { setErrors }: FormikHelpers<UserDto>) => {
        try {
            console.log(data)
            if (user)
                await dispatch(updateAuthUser(data)).unwrap()
        } catch (e) {
            const err = e as FetchApiError
            err.fields && setErrors(err.fields)
        }
    }, [user])

    return (
        <div className="account" ref={containerRef}>
            <h1 className="title display-large secondary-text">{'Account settings'.localize()}</h1>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                <Form>
                    <div>
                        <MdFormikField name="email" label={'Email'.localize()} disabled />
                        <MdFormikField name="firstName" label={'First name'.localize()} />
                        <MdFormikField name="lastName" label={'Last name'.localize()} />
                        <MdFormikField name="phone" label={'Phone number'.localize()} />
                    </div>
                    <div>
                        <SingleImageFormikField name="avatar" label={'Avatar'.localize()} />
                    </div>
                    <md-filled-button type="submit">
                        {'Save'.localize()}
                        <md-icon slot="icon">save</md-icon>
                    </md-filled-button>
                </Form>
            </Formik>
        </div>
    )
}