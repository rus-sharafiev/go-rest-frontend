import { createBrowserRouter } from "react-router-dom"
// components
import { App } from "../App"
import { PhotoConverter } from "../components/pages/PhotoConverter"
import { Account } from "../components/pages/Account"

// --------------------------------------------------------------------------------

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "account",
                element: <Account />,
            },
            {
                path: "photo-converter",
                element: <PhotoConverter />,
            },
        ],
    },
])