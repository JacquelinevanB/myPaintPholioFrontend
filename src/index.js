import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import AuthContextProvider from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </Router>
);

