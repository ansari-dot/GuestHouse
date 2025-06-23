import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = "https://api.sardarhouse.com/api"

// Mock data for development
const mockBookings = [
  {
    id: "1",
    guestName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    roomName: "Deluxe Mountain View",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    guests: 2,
    totalAmount: 360,
    status: "confirmed",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    guestName: "Jane Smith",
    email: "jane@example.com", 
    phone: "+0987654321",
    roomName: "Family Suite",
    checkIn: "2024-01-20",
    checkOut: "2024-01-23",
    guests: 4,
    totalAmount: 600,
    status: "pending",
    createdAt: "2024-01-12",
  },
]

export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async (_, { rejectWithValue, getState }) => {
  try {
    // For demo purposes, return mock data
    return mockBookings
    // const { token } = getState().auth
    // const response = await axios.get(`${API_URL}/bookings`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    // return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch bookings" })
  }
})

export const createBooking = createAsyncThunk("bookings/createBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to create booking" })
  }
})

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth
      const response = await axios.patch(
        `${API_URL}/bookings/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update booking status" })
    }
  },
)

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  success: false,
}

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingStatus: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch bookings"
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to create booking"
        state.success = false
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
        state.success = true
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update booking status"
        state.success = false
      })
  },
})

export const { clearBookingStatus } = bookingsSlice.actions
export default bookingsSlice.reducer