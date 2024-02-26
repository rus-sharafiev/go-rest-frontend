import { FC, useCallback, useEffect, useRef, useState } from "react"
import { Logo } from "./ui/icons"
import { useAppDispatch } from "../store"
import { logOut } from "../store/reducers/authSlice"
import { MdIconButton } from "@material/web/iconbutton/icon-button"
import { MdMenu } from "@material/web/menu/menu"

// --------------------------------------------------------------------------------

export const Header: FC = () => {
    const dispatch = useAppDispatch()
    const accountIconRef = useRef<MdIconButton>(null)
    const accountMenuRef = useRef<MdMenu>(null)

    const [menuIsOpened, setMenuIsOpened] = useState(false)

    const handleAccountButtonClick = useCallback((e: React.MouseEvent<MdIconButton>) => {
        // setMenuIsOpened(true)
        // setTimeout(() => {
        //     accountIconRef.current?.classList.add('menu-opened')
        //     document.addEventListener('click', handleClickOutsideMenu, { passive: true })
        // })

        accountMenuRef.current?.show()
    }, [])

    useEffect(() => {
        if (accountIconRef.current && accountMenuRef.current) {
            accountMenuRef.current.anchorElement = accountIconRef.current
            accountMenuRef.current.menuCorner = 'start-end'
            accountMenuRef.current.anchorCorner = 'end-start'
        }
    }, [])

    const handleClickOutsideMenu = useCallback((e: MouseEvent) => {
        document.removeEventListener('click', handleClickOutsideMenu)
        accountIconRef.current?.classList.remove('menu-opened')
        setTimeout(() => setMenuIsOpened(false), 500)
    }, [])

    return (
        <header>
            <md-elevation />
            <Logo />
            {/* <div ref={accountIconRef} className="account-icon"> */}
            <md-icon-button ref={accountIconRef} onClick={handleAccountButtonClick}>
                <md-icon>account_circle</md-icon>
            </md-icon-button>
            <md-menu ref={accountMenuRef}>
                <md-menu-item onClick={() => dispatch(logOut())}>
                    <div slot="headline">{'Settings'.localize()}</div>
                    <md-icon slot="start">settings</md-icon>
                </md-menu-item>
                <md-menu-item onClick={() => dispatch(logOut())}>
                    <div slot="headline">{'Log Out'.localize()}</div>
                    <md-icon slot="start">logout</md-icon>
                </md-menu-item>
            </md-menu>
            {/* </div> */}
        </header>
    )
}