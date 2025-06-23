import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  darkMode: localStorage.getItem("darkMode") === "true",
  rtl: localStorage.getItem("rtl") === "true",
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem("darkMode", state.darkMode)
    },
    toggleRTL: (state) => {
      state.rtl = !state.rtl
      localStorage.setItem("rtl", state.rtl)
    },
  },
})

export const { toggleDarkMode, toggleRTL } = themeSlice.actions
export default themeSlice.reducer