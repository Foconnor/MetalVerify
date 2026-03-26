import React,{ useState } from 'react'
import { calculateCoinDensity,calculateBarDensity } from './DensityCalculations.js'
import {uploadCoinProfiles} from "../../firebase/firestoreUpload.js"
import "./DensityTest.css"
import { saveDensityTest } from '../Account/DatabaseCode.js';

const COIN_SPECS = {
    eagle: {
      name: "American Silver Eagle",
      diameter: 4.06,
      thickness: 0.298,
      weight: 31.103,
      geometricDensity: 8.06,
    },
    maple:{
      name: "Canadian Silver Maple Leaf",
      diameter: 3.8,
      thickness: 0.329,
      weight: 31.103,
      geometricDensity: 8.34
    },
    britannia:{
      name: "British Silver Britannia",
      diameter: 3.861,
      thickness: 0.3,
      weight: 31.103,
      geometricDensity: 8.86
    },
    panda: {
      name: "Chinese Silver Panda",
      diameter: 4.0,
      thickness: 0.27,
      weight: 30,
      geometricDensity: 8.84
    }
  }

function DensityTest() {
  const [type, setType] = useState(""); // Coin or Bar
  const [coinData, setCoinData] = useState({ diameter: "", thickness: "", weight: "" });
  const [barData, setBarData] = useState({ length: "", height: "", width: "", weight: "" });
  const [calculatedDensity, setCalculatedDensity] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [barPosition, setBarPosition] = useState(50);
  const [selectedCoin, setSelectedCoin] = useState("unknown");

  const handleCoinChange = (e) => {
    setCoinData({ ...coinData, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    await uploadCoinProfiles();
  };

  const handleBarChange = (e) => {
    setBarData({ ...barData, [e.target.name]: e.target.value });
  };
  
  const handleCoinSelect = (e) => {
    const value = e.target.value;
    setSelectedCoin(value);
  };

  const getExpectedSpecs = () => {
    if (selectedCoin === "unknown") return null;
    return COIN_SPECS[selectedCoin];
  };

  const calculateConfidence = (density) => {
    const EXPECTED = selectedCoin === "unknown" ? 10.49 : getExpectedSpecs().geometricDensity;
    const TOLERANCE = 0.5; // Define tolerance in g/cm³

    const deviation = Math.abs(density - EXPECTED);
    const score = Math.max(0, 100 - (deviation / TOLERANCE) * 100);

    return Math.round(score);
  };

  const calculateBarPosition = (density) => {
    const EXPECTED = selectedCoin === "unknown" ? 10.49 : getExpectedSpecs().geometricDensity;
    const MAX_RANGE = 1;

    const deviation = density - EXPECTED;
    const position = 50 + (deviation / MAX_RANGE) * 50;
    return Math.min(100, Math.max(0, position));
  };

  const handleCoinCalculate = () => {
    try {
      const density = calculateCoinDensity(coinData.diameter, coinData.thickness, coinData.weight);
      
      const expectedDensity = selectedCoin === "unknown" ? 10.49 : getExpectedSpecs().geometricDensity;
      const deviation = Math.abs(density - expectedDensity);
      
      setCalculatedDensity(density);
      setConfidence(calculateConfidence(density));
      setBarPosition(calculateBarPosition(density));

      const testData = {
        itemType: "coin",
        selectedCoin: selectedCoin,
        inputs: { ...coinData },
        results: {
          density,
          expectedDensity,
          confidence: calculateConfidence(density),
        }
      }
      
      saveDensityTest(testData);

    } catch (err) {
      alert(err.message);
    }
  };

  const handleBarCalculate = () => {
    try {
      const density = calculateBarDensity(barData.length, barData.height, barData.width, barData.weight);
      setCalculatedDensity(density);
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
          {/* Coin Selector */}
          <div className="form-row">
            <label className="form-label">Select Coin:</label>
            <select
              value={selectedCoin}
              onChange={handleCoinSelect}
              className="form-input"
            >
              <option value="unknown">Not Sure / Don't Know</option>
              <option value="eagle">American Silver Eagle</option>
              <option value="maple">Canadian Maple Leaf</option>
              <option value="britannia">Britannia</option>
              <option value="panda">Chinese Panda (30g)</option>
            </select>
          </div>

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

      {calculatedDensity && (
        <div style={{ marginTop: "1.5rem", textAlign: "left", width: "320px" }}>
          
          <h3>Density Comparison</h3>

          <p>
            <strong>Pure Silver Expected:</strong> {selectedCoin === "unknown" ? "10.49" : getExpectedSpecs().geometricDensity} g/cm³
          </p>
          <p>
            <strong>Your Density:</strong> {calculatedDensity} g/cm³
          </p>

          {selectedCoin !== "unknown" && (
            <>
              <h3 style={{ marginTop: "1rem" }}>Measurement Comparison</h3>

              <table style={{ width: "100%", fontSize: "0.9rem" }}>
                <tbody>
                  <tr>
                    <td><strong>Measurement</strong></td>
                    <td><strong>Expected</strong></td>
                    <td><strong>Yours</strong></td>
                  </tr>
                  <tr>
                    <td>Diameter</td>
                    <td>{getExpectedSpecs().diameter} cm</td>
                    <td>{coinData.diameter} cm</td>
                  </tr>
                  <tr>
                    <td>Thickness</td>
                    <td>{getExpectedSpecs().thickness} cm</td>
                    <td>{coinData.thickness} cm</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{getExpectedSpecs().weight} g</td>
                    <td>{coinData.weight} g</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

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


      {/* // Coin Profiles Upload Button - Uncomment to use
      <hr />
      <button onClick={handleUpload} className="form-button">Upload Coin Profiles to Firestore</button>
      */}
    </div>

  )
}

export default DensityTest;