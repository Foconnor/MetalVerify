import React,{ useState } from 'react'
import { calculateCoinDensity,calculateBarDensity } from './DensityCalculations.js'

function DensityTest() {
  const [type, setType] = useState(""); // Coin or Bar
  const [coinData, setCoinData] = useState({ diameter: "", thickness: "", weight: "" });
  const [barData, setBarData] = useState({ length: "", height: "", width: "", weight: "" });
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleCoinChange = (e) => {
    setCoinData({ ...coinData, [e.target.name]: e.target.value });
  };

  const handleBarChange = (e) => {
    setBarData({ ...barData, [e.target.name]: e.target.value });
  };

  const calculateConfidence = (density) => {
    const EXPECTED = 10.49;
    const TOLERANCE = 0.5; // Define tolerance in g/cm³

    const deviation = Math.abs(density - EXPECTED);
    const score = Math.max(0, 100 - (deviation / TOLERANCE) * 100);

    return Math.round(score);
  };

  const handleCoinCalculate = () => {
    try {
      const density = calculateCoinDensity(coinData.diameter, coinData.thickness, coinData.weight);
      setResult(`Coin Density: ${density} g/cm³`);
      setConfidence(calculateConfidence(density));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBarCalculate = () => {
    try {
      const density = calculateBarDensity(barData.length, barData.height, barData.width, barData.weight);
      setResult(`Bar Density: ${density} g/cm³`);
      setConfidence(calculateConfidence(density));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",      // full height of the screen
        backgroundColor: "#222", // your dark background
        color: "#fff",
        fontFamily: "Arial",
      }}>
      <h1>Silver Density Calculator</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setType("coin")}>COIN</button>
        <button onClick={() => setType("bar")} style={{ marginLeft: "1rem" }}>BAR</button>
      </div>

      {/* Conditional rendering */}
      {type === "" && <p>Please select COIN or BAR to calculate density.</p>}

      {type === "coin" && (
        <div>
          {/* Diameter */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="diameter"
              placeholder="Diameter"
              value={coinData.diameter}
              onChange={handleCoinChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>cm</span>
          </div>

          {/* Thickness */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="thickness"
              placeholder="Thickness"
              value={coinData.thickness}
              onChange={handleCoinChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>cm</span>
          </div>

          {/* Weight */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={coinData.weight}
              onChange={handleCoinChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>g</span>
          </div>

          <button onClick={handleCoinCalculate} style={{ marginTop: "1rem" }}>Calculate</button>
        </div>
      )}

      {type === "bar" && (
        <div>
          {/* Length */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={barData.length}
              onChange={handleBarChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>cm</span>
          </div>

          {/* Height */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={barData.height}
              onChange={handleBarChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>cm</span>
          </div>

          {/* Width */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="width"
              placeholder="Width"
              value={barData.width}
              onChange={handleBarChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>cm</span>
          </div>

          {/* Weight */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={barData.weight}
              onChange={handleBarChange}
              style={{ marginRight: "0.5rem" }}
            />
            <span>g</span>
          </div>
          <button onClick={handleBarCalculate} style={{ marginLeft: "1rem" }}>Calculate</button>
        </div>
      )}

      {result && <h2 style={{ marginTop: "1rem" }}>{result}</h2>}
      {confidence !== null && (
  <div style={{ marginTop: "1rem", width: "260px" }}>
    
    {/* Gradient bar */}
    <div
      style={{
        position: "relative",
        height: "14px",
        borderRadius: "8px",
        background: "linear-gradient(to right, red, yellow, green)"
      }}
    >
      {/* Marker */}
      <div
        style={{
          position: "absolute",
          top: "-4px",
          left: `calc(${confidence}% - 2px)`,
          width: "4px",
          height: "22px",
          backgroundColor: "#fff"
        }}
      />
    </div>

    {/* Labels */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.75rem",
        marginTop: "4px",
        color: "#ccc"
      }}
    >
      <span>0%</span>
      <span>50%</span>
      <span>100%</span>
    </div>

    <p style={{ marginTop: "0.5rem" }}>
      Confidence: <strong style={{ fontSize: "2.8rem" }}>{confidence}%</strong>
    </p>
  </div>
)}
    </div>

  )
}

export default DensityTest;