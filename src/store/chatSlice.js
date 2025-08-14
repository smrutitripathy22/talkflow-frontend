import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChat: null,
  messages: {},
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state.messages[chatId] ||= [];
      state.messages[chatId].push(message);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveChat, setMessages, appendMessage, setLoading } =
  chatSlice.actions;

export default chatSlice.reducer;
