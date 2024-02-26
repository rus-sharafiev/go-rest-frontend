// main style
import './@styles/index.less'
import { Auth } from './components/Auth'
import { Header } from './components/Header'
import { Main } from './components/Main'

// @material
import "./components/ui/md-components"
import { useAppDispatch } from './store'
import api from './utils'

// components

// ----------------------------------------------------------------------

export const App: React.FC = () => {
    const dispatch = useAppDispatch()

    // Set auth header
    api.setAuthHeader()

    return (
        <>
            <Header />
            <Main />
            <Auth />
        </>
    )
}