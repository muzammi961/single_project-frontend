import { StrictMode } from 'react'
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./components/store.jsx";
createRoot(document.getElementById('root')).render(
  // <StrictMode >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <App />
      </PersistGate>
    </Provider>
  /* </StrictMode>, */
)
