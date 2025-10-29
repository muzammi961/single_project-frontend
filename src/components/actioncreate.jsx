import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: { 
    darkMode: true, 
    user: null, 
    autherazeduserId:null,
    messageandprofileviewid: null, 
    tripDatacalculate:null,
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
    setCalculateTripData: (state, action) => {
      state.tripDatacalculate = action.payload;
    },
    clearTripData: (state) => {
    state.tripDatacalculate = null;
    },
  },
});

export const { toggleDarkMode, setUser,setMessageandProfileViewid,AutherazedUserId,setCalculateTripData,clearTripData} = appSlice.actions;
export default appSlice.reducer;
