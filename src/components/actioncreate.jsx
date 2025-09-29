// import {createSlice } from '@reduxjs/toolkit';

// const appSlice = createSlice({
//   name: 'app',
//   initialState: {
//     darkMode: true,
//      user: null,
//   },
//   reducers: {
//     toggleDarkMode: (state) => {
//       state.darkMode = !state.darkMode;
//     },
    
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//   }
// });
// export const { toggleDarkMode,setUser  } = appSlice.actions;
// export default appSlice.reducer


import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: { darkMode: true, user: null },
  reducers: {
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode; },
    setUser: (state, action) => { state.user = action.payload; },
  },
});

export const { toggleDarkMode, setUser } = appSlice.actions;
export default appSlice.reducer;
