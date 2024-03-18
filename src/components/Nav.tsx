
// --------------------------------------------------------------------------------

import { useLocation, useNavigate } from "react-router-dom"
import { Logo } from "./ui/icons"
import { useEffect } from "react"

interface NavButtonProps {
    title: string
    icon: string
    path: string
    compact?: boolean
    active?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({ title, icon, compact, active, path }) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    return (
        <div
            className={`nav-button label-large ${'/' + pathname.split('/')[1] === path
                ? 'active primary on-primary-text'
                : 'on-surface-variant-text'
                }`}
            onClick={() => navigate(path)}
        >
            {/* <md-ripple /> */}
            <md-icon>{icon}</md-icon>
            {title}
        </div>
    )
}

export const Nav: React.FC = () => {


    return (
        <div className="nav-container">
            <Logo primary="var(--md-sys-color-primary)" />
            <nav>
                <NavButton title={'Home'.localize()} icon="home" path="/" />
                <NavButton title={'Photo converter'.localize()} icon="photo_size_select_small" path="/photo-converter" />
            </nav>
        </div>
    )
}