import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

// Mock data for development (fallback)
const mockRooms = [
  {
    _id: "1",
    name: "Deluxe Mountain View",
    type: "Deluxe",
    description: "Spacious room with panoramic mountain views and modern amenities.",
    price: 120,
    capacity: 2,
    size: 35,
    amenities: ["WiFi", "AC", "TV", "Balcony"],
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    available: true,
  },
  {
    _id: "2",
    name: "Family Suite",
    type: "Suite",
    description: "Perfect for families with separate living area and connecting rooms.",
    price: 200,
    capacity: 4,
    size: 65,
    amenities: ["WiFi", "AC", "TV", "Mini Bar", "Balcony"],
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    available: true,
  },
  {
    _id: "3",
    name: "Standard Room",
    type: "Standard",
    description: "Comfortable room with essential amenities for a pleasant stay.",
    price: 80,
    capacity: 2,
    size: 25,
    amenities: ["WiFi", "AC", "TV"],
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    available: true,
  },
]

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/getRooms")
    return response.data
  } catch (error) {
    console.error("Error fetching rooms:", error);
    // Return mock data as fallback
    return mockRooms;
  }
})

export const addRoom = createAsyncThunk("rooms/addRoom", async (roomData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/addRooms", roomData)
    return response.data.room
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to add room" })
  }
})

export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/rooms/${id}`, roomData)
      return response.data.room
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update room" })
    }
  },
)

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/deleteRoom/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to delete room" })
  }
})

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  success: false,
}

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearRoomStatus: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = action.payload
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch rooms"
      })
      .addCase(addRoom.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.loading = false
        state.rooms.push(action.payload)
        state.success = true
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to add room"
        state.success = false
      })
      .addCase(updateRoom.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false
        const index = state.rooms.findIndex((room) => room._id === action.payload._id)
        if (index !== -1) {
          state.rooms[index] = action.payload
        }
        state.success = true
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to update room"
        state.success = false
      })
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = state.rooms.filter((room) => room._id !== action.payload)
        state.success = true
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete room"
        state.success = false
      })
  },
})

export const { clearRoomStatus } = roomsSlice.actions
export default roomsSlice.reducer