import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/messages")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch messages" })
  }
})

export const markMessageAsRead = createAsyncThunk("messages/markAsRead", async (messageId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/messages/${messageId}/read`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to mark message as read" })
  }
})

export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (messageId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/messages/${messageId}`)
    return messageId
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to delete message" })
  }
})

const initialState = {
  messages: [],
  loading: false,
  error: null,
  success: false,
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessageStatus: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch messages"
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex((msg) => msg.id === action.payload.id)
        if (index !== -1) {
          state.messages[index] = action.payload
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((msg) => msg.id !== action.payload)
      })
  },
})

export const { clearMessageStatus } = messagesSlice.actions
export default messagesSlice.reducer 