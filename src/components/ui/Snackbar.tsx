import { createPortal } from "react-dom"
import { useAppSelector } from "../../store"
import { useEffect, useRef, useState } from "react"
import { closeSnackbar } from "../../store/reducers/snackbarSlice"

// --------------------------------------------------------------------------------

export const Snackbar: React.FC = () => {
    const {
        opened,
        text,
        actions,
        position = 'bottom',
        leadingIcon,
        timeout = 1400
    } = useAppSelector(state => state.snackbar)

    const snackbarRef = useRef<HTMLDivElement>(null)
    const timeoutIdRef = useRef<number>()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (opened) {
            setShow(true)
            setTimeout(() => {
                if (snackbarRef.current)
                    snackbarRef.current.classList.add('visible')
            }, 100)

            if (!actions?.cancel)
                setTimeout(() => closeSnackbar(), timeout)
        } else if (snackbarRef.current) {
            snackbarRef.current.classList.remove('visible')
            timeoutIdRef.current = setTimeout(() => setShow(false), 280)
        }

        return () => {
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = undefined
        }
    }, [opened])

    return (
        show && createPortal(
            <div className={`snackbar ${position}`} ref={snackbarRef}>
                <md-elevation />

                <span>
                    {leadingIcon}
                    {text}
                </span>

                {actions &&
                    <div>
                        {actions.submit &&
                            <md-filled-button
                                onClick={() => {
                                    actions.submitAction()
                                    closeSnackbar()
                                }}
                            >
                                {actions.submit}
                            </md-filled-button>}

                        {actions.cancel &&
                            <md-text-button
                                onClick={() => {
                                    actions.cancelAction && actions.cancelAction()
                                    closeSnackbar()
                                }}
                            >
                                {actions.cancel}
                            </md-text-button>}
                    </div>}

            </div>,
            document.body)
    )
}