import { useState } from 'react'
import "./DensityTest.css"
import { saveDensityTest } from '../Account/DatabaseCode.js';
import { saveScan } from '../../firebase/saveScan.js';

//coin imports
import CoinDensityTest from './Stages/CoinDensitytest.jsx';
import CoinDensityResult from './Stages/CoinDensityResult.jsx';

//bar imports
import BarDensityTest from './Stages/BarDensityTest.jsx';
import BarDensityResult from './Stages/BarDensityResult.jsx';

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

      if (user) {
        saveDensityTest(testData);
        console.log("Density test saved successfully");
        saveScan({
          userId: user.uid,
          testType: "density",
          metalType: type,
          profileName: selectedProfile.name,
          result: verdict,
          frequency: freq,
          duration,
          confidence,
          label,
          threeTestId
        });
      }

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

  const barRepeat = () => {
    setType("bar");
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

      {/* BAR FLOW */}
      {type === "bar" && stage === "input" && (
        <BarDensityTest onCalculate={handleResult} onHome={reset} />
      )}

      {type === "bar" && stage === "result" && resultData && (
        <BarDensityResult data={resultData} onReset={barRepeat} />
      )}
    </div>

  )
}

export default DensityTest;