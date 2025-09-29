import { StrictMode } from 'react'
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './components/store.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode >
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
