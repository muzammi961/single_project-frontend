// import {configureStore,combineReducers } from "@reduxjs/toolkit"
// import appSlice  from "./actioncreate"


// const rootReducer = combineReducers({
//   app: appReducer, // must be a valid reducer function
// });


// export const store = configureStore({
//   reducer: {
//     app: appSlice.reducer,
//     reducer: rootReducer,
//   }
// });
// export default store


import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./actioncreate"; // This must export reducer

export const store = configureStore({
  reducer: {
    app: appReducer, // ✅ just use the slice reducer
  },
});

export default store;
