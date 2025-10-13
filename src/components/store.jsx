// import { configureStore } from "@reduxjs/toolkit";
// import appReducer from "./actioncreate"; // This must export reducer

// export const store = configureStore({
//   reducer: {
//     app: appReducer, 
//   },
// });

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./actioncreate";

// persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["app"], // persist only the app slice
};

const rootReducer = combineReducers({
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
