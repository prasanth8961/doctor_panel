import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as RootRouter } from 'react-router-dom';
import './global/style.css'
import App from './App.jsx'
import { store } from './App/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RootRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </RootRouter>
  </Provider>
)
