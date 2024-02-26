import { HTMLAttributes, useEffect, useRef } from "react"
import { useField } from "formik"
import { ReCAPTCHA } from "../../@types/reCAPTCHA"

// --------------------------------------------------------------------------------

declare var grecaptcha: ReCAPTCHA

type ReCaptchaFormikFieldProps = HTMLAttributes<HTMLDivElement> & {
    name: string
}

export const ReCaptchaFormikField: React.FC<ReCaptchaFormikFieldProps> = ({ name, ...props }) => {
    const [_, { error }, { setValue }] = useField(name)

    const recaptchaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (() => {
            if (recaptchaRef.current)
                grecaptcha.render(recaptchaRef.current, {
                    'sitekey': '6LfW_nQoAAAAAJwlmah6rfrXNgXgnnL6OS8Sj-Zm',
                    'callback': (responseToken: string) => setValue(responseToken)
                })
        })()
    }, [])

    return (
        <div {...props} >
            <div ref={recaptchaRef}></div>
            {error &&
                <span className="error-text body-small">{error}</span>}
        </div>
    )
}