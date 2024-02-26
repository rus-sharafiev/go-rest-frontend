import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { ReactNode } from "react"
// components
import { App } from "../App"

// --------------------------------------------------------------------------------

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [],
    },
])