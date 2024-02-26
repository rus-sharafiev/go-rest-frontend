import { FormEvent, useCallback } from "react"
import { useField } from "formik"
import { WebComponent } from "../../@types/web-components"
import { MdCheckbox } from "@material/web/checkbox/checkbox"

// --------------------------------------------------------------------------------

type MdFormikCheckboxProps = WebComponent<MdCheckbox> & {
    name: string
    label: string
    className?: string
}

export const MdFormikCheckbox: React.FC<MdFormikCheckboxProps> = ({ name, label, className, ...props }) => {
    const [_, { error }, { setValue }] = useField(name)

    const handleInput = useCallback((e: FormEvent<MdCheckbox>) => {
        setValue((e.target as MdCheckbox).checked)
    }, [])

    return (
        <label className={className}>
            <md-checkbox touch-target="wrapper" {...props} onInput={handleInput} />
            <span className="label">{label}</span>
            {error &&
                <span className="error-text">{error}</span>}
        </label>
    )
}