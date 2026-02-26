import React,{ useState } from 'react'
import { calculateCoinDensity,calculateBarDensity } from './DensityCalculations.js'
import "./DensityTest.css"

function DensityTest() {
  const [type, setType] = useState(""); // Coin or Bar
  const [coinData, setCoinData] = useState({ diameter: "", thickness: "", weight: "" });
  const [barData, setBarData] = useState({ length: "", height: "", width: "", weight: "" });
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [barPosition, setBarPosition] = useState(50);

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

  const calculateBarPosition = (density) => {
    const EXPECTED = 10.49;
    const MAX_RANGE = 1;

    const deviation = density - EXPECTED;
    const position = 50 + (deviation / MAX_RANGE) * 50;
    return Math.min(100, Math.max(0, position));
  };

  const handleCoinCalculate = () => {
    try {
      const density = calculateCoinDensity(coinData.diameter, coinData.thickness, coinData.weight);
      setResult(`Coin Density: ${density} g/cm³`);
      setConfidence(calculateConfidence(density));
      setBarPosition(calculateBarPosition(density));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBarCalculate = () => {
    try {
      const density = calculateBarDensity(barData.length, barData.height, barData.width, barData.weight);
      setResult(`Bar Density: ${density} g/cm³`);
      setConfidence(calculateConfidence(density));
      setBarPosition(calculateBarPosition(density));
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
          <div className="form-row">
            <label className="form-label">Diameter:</label>
            <input
              type="number"
              name="diameter"
              value={coinData.diameter}
              onChange={handleCoinChange}
              className="form-input"
            />
            <span>cm</span>
          </div>

          {/* Thickness */}
          <div className="form-row">
            <label className="form-label">Thickness:</label>
            <input
              type="number"
              name="thickness"
              value={coinData.thickness}
              onChange={handleCoinChange}
              className="form-input"
            />
            <span>cm</span>
          </div>

          {/* Weight */}
          <div className="form-row">
            <label className="form-label">Weight:</label>
            <input
              type="number"
              name="weight"
              value={coinData.weight}
              onChange={handleCoinChange}
              className="form-input"
            />
            <span>g</span>
          </div>

          <button onClick={handleCoinCalculate} className="form-button">Calculate</button>
        </div>
      )}

      {type === "bar" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Length */}
          <div className="form-row">
            <label className="form-label">Length:</label>
            <input
              type="number"
              name="length"
              value={barData.length}
              onChange={handleBarChange}
              className="form-input"
            />
            <span>cm</span>
          </div>

          {/* Height */}
          <div className="form-row">
            <label className="form-label">Height:</label>
            <input
              type="number"
              name="height"
              value={barData.height}
              onChange={handleBarChange}
              className="form-input"
            />
            <span>cm</span>
          </div>

          {/* Width */}
          <div className="form-row">
            <label className="form-label">Width:</label>
            <input
              type="number"
              name="width"
              value={barData.width}
              onChange={handleBarChange}
              className="form-input"
            />
            <span>cm</span>
          </div>

          {/* Weight */}
          <div className="form-row">
            <label className="form-label">Weight:</label>
            <input
              type="number"
              name="weight"
              value={barData.weight}
              onChange={handleBarChange}
              className="form-input"
            />
            <span>g</span>
          </div>
          <button onClick={handleBarCalculate} className="form-button">Calculate</button>
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
              background: "linear-gradient(to right, red, yellow, green, yellow, red)",
            }}
          >
            {/* Marker */}
            <div
              style={{
                position: "absolute",
                top: "-4px",
                left: `calc(${barPosition}% - 2px)`,
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
            <span>LOW</span>
            <span>PERFECT</span>
            <span>High</span>
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