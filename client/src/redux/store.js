import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "./slices/themeSlice"
import authReducer from "./slices/authSlice"
import roomsReducer from "./slices/roomsSlice"
import bookingsReducer from "./slices/bookingsSlice"
import messagesReducer from "./slices/messagesSlice"

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
    messages: messagesReducer,
  },
})

export default store