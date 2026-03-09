import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home.jsx';
import PingPage from './pages/PingPage.jsx';
import DensityPage from './pages/DensityPage.jsx';
import Accounts from './features/Account/Accounts';

function App() {

  return (
    <Router>
      <div style={{display:'flex'}}>

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
          <h3>Metal Verify</h3>

          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/">Home</Link>
            <Link to="/ping">Ping Test</Link>
            <Link to="/density">Density Test</Link>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "2rem" }}>

          {/* Top right login */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Accounts />
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ping" element={<PingPage />} />
            <Route path="/density" element={<DensityPage />} />
          </Routes>
          
        </div>
      </div>
    </Router>
  )

}

export default App
