import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home.jsx';
import PingPage from './pages/PingPage.jsx';
import DensityPage from './pages/DensityPage.jsx';

import Accounts from './features/Account/Accounts.jsx';
import Login from './features/Account/Login.jsx';
import Signup from './features/Account/Signup.jsx'

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// temp pages (create if not yet)
import HistoryPage from "./pages/HistoryPage";
import AdminDashboard from "./pages/AdminDashboard";


function App() {

  return (
    <Router>
      <div style={{display:'flex', flexDirection: "column"}}>

        {/* SIDEBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            borderBottom: "1px solid gray"
          }}
        >
         <div>
          <h3>Metal Verify</h3>
         </div>
          
          <div>
            <nav style={{ display: "flex", gap: "2rem" }}>
              <Link to="/">Home</Link>
              <Link to="/ping">Ping Test</Link>
              <Link to="/density">Density Test</Link>
            </nav>
          </div>
          
          <div>
            <Accounts />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "2rem" }}>

            <Routes>
                <Route path="/" element={<Home />} />

                {/* Testing Pages */}
                <Route path="/ping" element={<PingPage />} />
                <Route path="/density" element={<DensityPage />} />

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
