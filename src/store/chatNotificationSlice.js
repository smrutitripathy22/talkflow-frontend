
import { createSlice } from "@reduxjs/toolkit";

const chatNotificationSlice = createSlice({
  name: "chatNotification",
  initialState: {
    unreadMessages: [], 
  },
  reducers: {
    addNotification: (state, action) => {
     
      const exists = state.unreadMessages.find(n => n.chatId === action.payload.chatId);
      if (!exists) {
        state.unreadMessages.push(action.payload);
      }
    },
    clearNotification: (state, action) => {
      state.unreadMessages = state.unreadMessages.filter(
        n => n.chatId !== action.payload
      );
    }
  }
});

export const { addNotification, clearNotification } = chatNotificationSlice.actions;
export default chatNotificationSlice.reducer;
