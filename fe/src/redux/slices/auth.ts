import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userInfo: null,
  },

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = {  ...action.payload };
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = { ...action.payload };
    },
  },
});
export const { login, logOut, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
