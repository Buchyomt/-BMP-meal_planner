import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/index.css';

const GOOGLE_CLIENT_ID = "695485100101-rva8mkdjh1pvg6k6q1g8gra7dmd4di9o.apps.googleusercontent.com";

// Clean render block without persistence for troubleshooting
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
