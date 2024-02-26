declare global {
    interface String {
        toHHMMSS(): string
        toReactCSSobject(): React.CSSProperties
        localize(): string
    }

    interface Number {
        declination(titles: string[]): string
    }

    interface Array<T> {
        move(from: number, to: number): void
    }
}

// --------------------------------------------------------------------------------

const language = localStorage.getItem('preferredLanguage')
    ?? window.navigator.language.substring(0, 2).toUpperCase()

String.prototype.localize = function () {
    switch (language) {
        case 'RU':
            if (!!ru[`${this}`])
                return ru[`${this}`]

        default:
            return this.toString()
    }
}

String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this as string, 10)
    let hours: number | string = Math.floor(sec_num / 3600)
    let minutes: number | string = Math.floor((sec_num - (hours * 3600)) / 60)
    let seconds: number | string = sec_num - (hours * 3600) - (minutes * 60)

    if (hours < 10)
        hours = "0" + hours
    if (minutes < 10)
        minutes = "0" + minutes
    if (seconds < 10)
        seconds = "0" + seconds

    if (hours !== '00')
        return `${hours}:${minutes}:${seconds}`
    else
        return `${minutes}:${seconds}`
}

String.prototype.toReactCSSobject = function () {
    const css_json = `{${this
        .replace(/;(?=.*;)/g, '", "')
        .replace(/: /g, '": "')
        .replace(';', '')
        }}`

    let obj: Record<string, string>
    try {
        obj = JSON.parse(css_json)
    } catch {
        return {}
    }

    const keyValues = Object.keys(obj).map((key) => {
        var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase())
        return { [camelCased]: obj[key] };
    })
    return Object.assign({}, ...keyValues)
}

Number.prototype.declination = function (titles: string[]) {
    const number = this as number

    const decCache: number[] = []
    const decCases = [2, 0, 1, 1, 1, 2]

    if (!decCache[number])
        decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)]

    return titles[decCache[number]]
}

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0])
}

// --------------------------------------------------------------------------------

import { ru } from "../localization/ru"
import { api, ApiRoutes, BASE_URL } from "./api"
import { IS_SAFARI, IS_CHROME, IS_FIREFOX, IS_IOS, IS_APPLE, IS_APPLE_WEBKIT } from "./environment"

export { ApiRoutes, BASE_URL, IS_SAFARI, IS_CHROME, IS_FIREFOX, IS_IOS, IS_APPLE, IS_APPLE_WEBKIT }
export default api