import { useState } from 'react'
import "./DensityTest.css"

import CoinDensityTest from './Stages/CoinDensitytest.jsx';
import CoinDensityResult from './Stages/CoinDensityResult.jsx';

function DensityTest() {
  const [type, setType] = useState(""); // Coin or Bar
  const [stage, setStage] = useState("input"); // select, input, result
  const [resultData, setResultData] = useState(null); // Store calculated density and confidence
  
  const handleResult = (data) => {
    setResultData(data);
    setStage("result");
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