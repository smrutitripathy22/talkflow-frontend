import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import authReducer from "./authSlice";
import groupReducer from "./groupSlice";
import chatNotificationReducer from "./chatNotificationSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    group: groupReducer,
    chatNotification:chatNotificationReducer
  },
});
