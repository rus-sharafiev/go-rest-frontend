// main style
import './@styles/index.less'

// @material
import "./components/ui/md-components"

// components
import { Auth } from './components/Auth'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { Nav } from './components/Nav'
import { Logo } from './components/ui/icons'


// ----------------------------------------------------------------------

export const App: React.FC = () => {

    return (
        <>
            <Header />
            <Main />
            <Nav />

            <Auth />
        </>
    )
}