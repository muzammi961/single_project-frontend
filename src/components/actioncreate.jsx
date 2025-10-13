import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: { 
    darkMode: true, 
    user: null, 
    autherazeduserId:null,
    messageandprofileviewid: null 
  },
  reducers: {
    setMessageandProfileViewid: (state, action) => {
      state.messageandprofileviewid = action.payload;
    },
    AutherazedUserId: (state, action) => {
      state.autherazeduserId = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { toggleDarkMode, setUser,setMessageandProfileViewid,AutherazedUserId} = appSlice.actions;
export default appSlice.reducer;
