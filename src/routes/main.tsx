import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../components/App';
import '../index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="345256826288-rk8oo0jl88v8og3bn7msb0hc7m8u0qha.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
