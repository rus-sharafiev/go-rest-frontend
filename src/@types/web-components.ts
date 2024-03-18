import { MdFilledTonalIconButton } from '@material/web/iconbutton/filled-tonal-icon-button'
import { MdOutlinedIconButton } from "@material/web/iconbutton/outlined-icon-button"
import { MdNavigationBar } from "@material/web/labs/navigationbar/navigation-bar"
import { MdNavigationTab } from "@material/web/labs/navigationtab/navigation-tab"
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field"
import { MdFilledIconButton } from "@material/web/iconbutton/filled-icon-button"
import { MdFilledTonalButton } from "@material/web/button/filled-tonal-button"
import { MdCircularProgress } from "@material/web/progress/circular-progress"
import { MdOutlinedButton } from "@material/web/button/outlined-button"
import { MdFilledButton } from "@material/web/button/filled-button"
import { MdIconButton } from "@material/web/iconbutton/icon-button"
import { MdSecondaryTab } from "@material/web/tabs/secondary-tab"
import { MdTextButton } from "@material/web/button/text-button"
import { MdElevation } from "@material/web/elevation/elevation"
import { MdPrimaryTab } from "@material/web/tabs/primary-tab"
import { MdCheckbox } from "@material/web/checkbox/checkbox"
import { MdListItem } from "@material/web/list/list-item"
import { MdMenuItem } from "@material/web/menu/menu-item"
import { MdRipple } from "@material/web/ripple/ripple"
import { MdDialog } from "@material/web/dialog/dialog"
import { MdList } from "@material/web/list/list"
import { MdMenu } from "@material/web/menu/menu"
import { MdIcon } from "@material/web/icon/icon"
import { MdTabs } from "@material/web/tabs/tabs"
import { MdFab } from "@material/web/fab/fab"

// --------------------------------------------------------------------------------

type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? "-" : ""}${Lowercase<T>}${CamelToKebab<U>}`
    : S

type HtmlCase<T> = { [K in keyof T as CamelToKebab<K & string>]: T[K] }

type CustomTypes<T> = {
    style: React.CSSProperties
    class: string,
    children: any,
    ref: React.RefObject<T>,
    key: string
}

export type WebComponent<T> = Partial<Omit<HtmlCase<T>, 'style' | 'class-name'> & React.DOMAttributes<T> & CustomTypes<T>>

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['md-icon']: WebComponent<MdIcon & { filled: boolean, type: string }>
            ['md-filled-tonal-icon-button']: WebComponent<MdFilledTonalIconButton>
            ['md-outlined-icon-button']: WebComponent<MdOutlinedIconButton>
            ['md-outlined-text-field']: WebComponent<MdOutlinedTextField>
            ['md-filled-tonal-button']: WebComponent<MdFilledTonalButton>
            ['md-filled-icon-button']: WebComponent<MdFilledIconButton>
            ['md-circular-progress']: WebComponent<MdCircularProgress>
            ['md-outlined-button']: WebComponent<MdOutlinedButton>
            ['md-navigation-bar']: WebComponent<MdNavigationBar>
            ['md-navigation-tab']: WebComponent<MdNavigationTab>
            ['md-filled-button']: WebComponent<MdFilledButton>
            ['md-secondary-tab']: WebComponent<MdSecondaryTab>
            ['md-primary-tab']: WebComponent<MdPrimaryTab>
            ['md-icon-button']: WebComponent<MdIconButton>
            ['md-text-button']: WebComponent<MdTextButton>
            ['md-elevation']: WebComponent<MdElevation>
            ['md-list-item']: WebComponent<MdListItem>
            ['md-menu-item']: WebComponent<MdMenuItem>
            ['md-checkbox']: WebComponent<MdCheckbox>
            ['md-ripple']: WebComponent<MdRipple>
            ['md-dialog']: WebComponent<MdDialog>
            ['md-ripple']: WebComponent<MdRipple>
            ['md-list']: WebComponent<MdList>
            ['md-tabs']: WebComponent<MdTabs>
            ['md-menu']: WebComponent<MdMenu>
            ['md-fab']: WebComponent<MdFab>

        }
    }
}

// declare slot prop for using svg as icon
declare module 'react' {
    interface SVGProps<T> {
        slot?: string
    }
}