import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field"
import { FC, FormEvent, KeyboardEvent, useCallback, useEffect, useRef } from "react"
import { useField, useFormikContext } from "formik"
import { WebComponent } from "../../@types/web-components"

// --------------------------------------------------------------------------------

type MdFormikFieldProps = WebComponent<MdOutlinedTextField> & {
    name: string
    icon?: string
}

/**
 * Wrapper around Google Material Outlined Text Field web component to use with the Formik  
 * It uses `useField` hook under the hood and should be placed inside the `Formik` tag  
 * If type === 'number', filters numeric input and set value as number
 * 
 * @prop {string} name - A Formik field name
 * @prop {string} [icon] - An optional Material symbol name for the leading icon ({@link https://fonts.google.com/icons})
 *
 * @author Rus Sharafiev <https://github.com/rus-sharafiev>
 */
export const MdFormikField: FC<MdFormikFieldProps> = ({ name, icon, type, ...props }) => {
    const [_, { error }, { setValue }] = useField(name)
    const { submitForm } = useFormikContext()

    const fieldRef = useRef<MdOutlinedTextField>(null)
    const isNumberField = type === 'number'

    const handleInput = useCallback((e: FormEvent<MdOutlinedTextField>) => {
        const field = e.target as MdOutlinedTextField
        if (isNumberField) field.value = field.value.match(/\d/g)?.join('') ?? ''
        setValue(isNumberField ? Number(field.value) : field.value, field.errorText ? true : false)
    }, [])

    const handleSubmit = useCallback((e: KeyboardEvent<MdOutlinedTextField>) =>
        e.key === "Enter" && submitForm(), [])

    useEffect(() => {
        if (!fieldRef.current) return
        const field = fieldRef.current

        if (error) {
            field.error = true
            field.errorText = error
        } else {
            field.error = false
        }
    }, [error, fieldRef.current])

    return (
        <md-outlined-text-field
            ref={fieldRef}
            onInput={handleInput}
            onKeyUp={handleSubmit}
            type={isNumberField ? undefined : type}
            input-mode={isNumberField ? 'numeric' : undefined}
            {...props}
        >
            {icon &&
                <md-icon slot="leading-icon">{icon}</md-icon>}
            {error &&
                <md-icon slot="trailing-icon" filled>error</md-icon>}
        </md-outlined-text-field>
    )
}