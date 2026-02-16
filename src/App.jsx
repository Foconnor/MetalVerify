import { useState } from 'react'
import './App.css'
import PingTest from './features/ping/Pingtest';
import DensityTest from './features/density/DensityTest';

function App() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Metal Verify</h1>

      <button onClick={() => setActiveFeature("ping")}>
        Run Ping Test
      </button>

      <button onClick={() => setActiveFeature("density")}>
        Run Density Test
      </button>

      <div style={{ marginTop: "2rem" }}>
        {activeFeature === "ping" && <PingTest />}
        {activeFeature === "density" && <DensityTest />}
      </div>
    </div>
  );

}

export default App
