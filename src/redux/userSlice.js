import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  roles: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;