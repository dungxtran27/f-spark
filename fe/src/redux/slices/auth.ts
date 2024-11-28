import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userInfo: null,
    activeTerm: null,
  },

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = { ...action.payload };
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.activeTerm = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = { ...action.payload };
    },
    setActiveTerm: (state, action) => {
      state.activeTerm = { ...action.payload };
    },
  },
});
export const { login, logOut, setUserInfo, setActiveTerm } = authSlice.actions;
export default authSlice.reducer;
