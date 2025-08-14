import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeGroup: null,
  messages: {},
  loading: false,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    appendGroupMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state.messages[chatId] ||= [];
      state.messages[chatId].push(message);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveGroup, setMessages, appendGroupMessage, setLoading } =
  groupSlice.actions;

export default groupSlice.reducer;
