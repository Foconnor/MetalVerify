import { useState } from 'react'
import "./DensityTest.css"

// const COIN_SPECS = {
//     eagle: {
//       name: "American Silver Eagle",
//       diameter: 4.06,
//       thickness: 0.298,
//       weight: 31.103,
//       geometricDensity: 8.06,
//     },
//     maple:{
//       name: "Canadian Silver Maple Leaf",
//       diameter: 3.8,
//       thickness: 0.329,
//       weight: 31.103,
//       geometricDensity: 8.34
//     },
//     britannia:{
//       name: "British Silver Britannia",
//       diameter: 3.861,
//       thickness: 0.3,
//       weight: 31.103,
//       geometricDensity: 8.86
//     },
//     panda: {
//       name: "Chinese Silver Panda",
//       diameter: 4.0,
//       thickness: 0.27,
//       weight: 30,
//       geometricDensity: 8.84
//     }
//   }
import CoinDensityTest from './Stages/CoinDensitytest.jsx';
import CoinDensityResult from './Stages/CoinDensityResult.jsx';

function DensityTest() {
  const [label, setLabel] = useState("");
  const [threeTestId, setThreeTestId] = useState(null);
  const [type, setType] = useState(""); // Coin or Bar
  const [stage, setStage] = useState("input"); // select, input, result
  const [resultData, setResultData] = useState(null); // Store calculated density and confidence
  
  const handleResult = (data) => {
    setResultData(data);
    setStage("result");
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
        },
        label,
        threeTestId
      }
      
      saveDensityTest(testData);

    } catch (err) {
      alert(err.message);
    }
  };
  const reset = () => {
    setType("");
    setStage("input");
    setResultData(null);
  }

  const coinRepeat = () => {
    setType("coin");
    setStage("input");
    setResultData(null);
  }

  return (
    <div>
      {type === "" && stage === "input" && (
        <div className="selection-container">
          <h2>Select Test Type</h2>
          <button onClick={() => setType("coin")}>COIN</button>
          <button onClick={() => setType("bar")}>BAR</button>
        </div>
      )}

      {/* COIN FLOW */}
      {type === "coin" && stage === "input" && (
        <CoinDensityTest onCalculate={handleResult} onHome={reset} />
      )}

      {type === "coin" && stage === "result" && resultData && (
        <CoinDensityResult data={resultData} onReset={coinRepeat} />
      )}
    </div>

  )
}

export default DensityTest;