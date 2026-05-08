import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ThreeTestProvider } from "./context/ThreeTestContext";
import { TestSessionProvider } from "./context/TestSessionContext";
import {TestStoreProvider} from "./context/TestStoreContext.jsx";


createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <ThreeTestProvider>
        <TestSessionProvider>
            <TestStoreProvider>
        <App />
                </TestStoreProvider>
            </TestSessionProvider>
    </ThreeTestProvider>
    </AuthProvider>,
)
