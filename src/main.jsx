import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ThreeTestProvider } from "./context/ThreeTestContext";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <ThreeTestProvider>
        <App />
    </ThreeTestProvider>
    </AuthProvider>,
)
