import { useEffect, useState } from "react";
import { saveDensityTest } from '../../Account/DatabaseCode.js';
import { saveScan } from '../../../firebase/saveScan.js';
import { getAuth } from "firebase/auth";

function CoinDensityResult({ data, onReset }) {
  const [barPosition, setBarPosition] = useState(50);
  const user = getAuth().currentUser;

  const calculateBarPosition = (density) => {
    const EXPECTED = data.selectedCoinData !== null ? data.selectedCoinData.expectedDensity : 10.49;
    console.log("Expected Density:", EXPECTED);
    const MAX_RANGE = 2;

    console.log("Input Density:", density);
    const deviation = parseFloat(density) - EXPECTED;
    console.log("Deviation:", deviation);
    const position = 50 + (deviation / MAX_RANGE) * 50;
    console.log("Calculated Position:", position);
    return Math.min(100, Math.max(0, position));
  };

  const getResultVerdict = (confidence) => {
    let verdict = "";
    if (confidence >= 90) verdict = "Highly Likely Genuine";
    else if (confidence >= 70) verdict = "Likely Genuine";
    else if (confidence >= 50) verdict = "Uncertain";
    else if (confidence >= 30) verdict = "Likely Fake";
    else verdict = "Very Likely Fake";

    return verdict;
  }

  const handleUpload = () => {
    // Saving to database
    if (user) {
        saveDensityTest({
            density: data.results.density,
            confidence: data.results.confidence,
            threeTestId: data.threeTestId,
            label: data.label
        });
        console.log("Density test saved successfully. Data:", {
            density: data.results.density,
            confidence: data.results.confidence,
            threeTestId: data.threeTestId,
            label: data.label
        });

        saveScan({
          userId: user.uid,
          testType: "density",
          metalType: data.itemType,
          profileName: data.selectedProfile ? data.selectedProfile.name : "Unknown Profile",
          result: getResultVerdict(data.results.confidence),
          frequency: data.frequency || null,
          duration: data.duration || null,
          confidence: data.results.confidence || null,
        });
        console.log("Scan saved successfully.");
    }
  };


  useEffect(() => {
    if (data.results.density !== null) {
      const position = calculateBarPosition(data.results.density);
      setBarPosition(position);
      console.log("Calculated Bar Position:", position);
    }
  }, [data.results.density]);


  return (
    <div>
      <h2>Coin Results</h2>

      {console.log("Result Data:", data)}

      {data.results.confidence !== null && (
        <div style={{ marginTop: "1rem", width: "260px", margin: "0 auto", textAlign: "center" }}>
          
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
                backgroundColor: "#0c0a0a"
              }}
            />
            {console.log("Bar Position:", barPosition)}
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
            Confidence: <strong style={{ fontSize: "2.8rem" }}>{data.results.confidence}%</strong>
          </p>
        </div>
      )}


      <button onClick={onReset}>Test Again</button>
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>Save Result</button>
    </div>
  );
}

export default CoinDensityResult;