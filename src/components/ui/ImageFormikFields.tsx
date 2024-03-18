import { useCallback, useEffect, useState } from "react"
import { useField } from "formik"
import { WebComponent } from "../../@types/web-components"
import { MdCheckbox } from "@material/web/checkbox/checkbox"
import createThumbnail from "../../utils/imageReader"
import { getLinkWithToken } from "../../utils/api"

// --------------------------------------------------------------------------------

type ImageFormikFieldProps = WebComponent<MdCheckbox> & {
    name: string
    label?: string
    className?: string
}

export const SingleImageFormikField: React.FC<ImageFormikFieldProps> = ({ name, label, className }) => {
    const [{ value }, { error }, { setValue }] = useField<string | File>(name)

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0)
            createThumbnail(e.target.files[0], 300, 300)
                .then(url => setThumbnail(url))
                .then(() => e.target.files && setValue(e.target.files[0]))
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        const file = e.dataTransfer.files[0]
        if (file)
            createThumbnail(file, 200, 200)
                .then(url => setThumbnail(url))
                .then(() => setValue(file))
                .finally(() => {
                    const target = e.target as HTMLLabelElement | HTMLImageElement
                    if (target.tagName === 'IMG')
                        target.parentElement?.classList.remove('hovered')
                    else
                        target.classList.remove('hovered')
                })
    }, [])

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        const target = e.target as HTMLLabelElement | HTMLImageElement
        if (target.tagName === 'IMG')
            target.parentElement?.classList.add('hovered')
        else
            target.classList.add('hovered')
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        const target = e.target as HTMLLabelElement | HTMLImageElement
        if (target.tagName === 'IMG')
            target.parentElement?.classList.remove('hovered')
        else
            target.classList.remove('hovered')
    }, [])

    const [thumbnail, setThumbnail] = useState<string>()

    useEffect(() => {
        return () => setThumbnail(undefined)
    }, [])

    return (
        <label
            className={`avatar label-large on-surface-text ${className ?? ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {value || thumbnail
                ? <img src={typeof value === 'string' ? getLinkWithToken(value) : thumbnail} alt="user-avatar" />
                : label}
            <input
                type='file' accept="image/png, image/jpeg"
                onChange={handleInputChange}
                style={{ visibility: 'hidden' }}
            />
        </label>
    )
}