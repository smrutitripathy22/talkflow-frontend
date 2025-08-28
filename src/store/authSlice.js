import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("talkflow_auth_token") || null,
  user: JSON.parse(localStorage.getItem("talkflow_auth_user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("talkflow_auth_token", action.payload.token);
      localStorage.setItem("talkflow_auth_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("talkflow_auth_token");
      localStorage.removeItem("talkflow_auth_user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
