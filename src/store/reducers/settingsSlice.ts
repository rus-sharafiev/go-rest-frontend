import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// --------------------------------------------------------------------------------

const language = window.navigator.language.substring(0, 2).toUpperCase()

const initialState: {
    language: string
} = {
    language
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {

        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload
        },

    },
})

export const { setLanguage } = settingsSlice.actions

export default settingsSlice.reducer