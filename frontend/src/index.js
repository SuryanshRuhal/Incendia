import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/usercontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <React.StrictMode>
  <UserProvider>
    <App />
    </UserProvider>
  </React.StrictMode>
  </BrowserRouter>
);

