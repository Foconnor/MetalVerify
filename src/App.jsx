import { useState } from 'react'
import { useAuth } from "./context/AuthContext";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import PingPage from './pages/PingPage.jsx';
import DensityPage from './pages/DensityPage.jsx';
import MagnetPage from './pages/MagnetPage.jsx';

import Accounts from './features/Account/Accounts.jsx';
import Login from './features/Account/Login.jsx';
import Signup from './features/Account/Signup.jsx'

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// temp pages (create if not yet)
import HistoryPage from "./pages/HistoryPage";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
    const { user, isAdmin } = useAuth();

  return (
    <Router>
      <div style={{display:'flex', flexDirection: "column"}}>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "2rem" }}>

            <Routes>
                <Route path="/" element={<Home />} />

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard />
                  }
                />

                {/* Testing Pages */}
                <Route path="/ping" element={<PingPage />} />
                <Route path="/density" element={<DensityPage />} />
                <Route path="/magnet" element={<MagnetPage />} />

                {/* Account Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* 🔐 Protected Route (logged-in users only) */}
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    }
                />

                {/* 🛠 Admin Route */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
            </Routes>

          
        </div>
      </div>
    </Router>
  )

}

export default App
