import { useState } from "react";
import InfoStage from "./Stages/InfoStage.jsx";
import TestStage from "../magnet/Stages/TestStage.jsx";
import ResultStage from "../magnet/Stages/ResultStage.jsx";

function MagnetTest() {
  const [step, setStep] = useState(1);

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>Magnet Test</h1>

      {/* Progress */}
      <p>Step {step} of 3</p>

      {/* Stage Rendering */}
      {step === 1 && <InfoStage />}
      {step === 2 && <TestStage />}
      {step === 3 && <ResultStage />}

      {/* Navigation Buttons */}
      <div style={{ marginTop: "20px" }}>
        {step > 1 && <button onClick={back}>Back</button>}
        {step < 3 && <button onClick={next} style={{ marginLeft: "10px" }}>Next</button>}
      </div>
    </div>
  );
}

export default MagnetTest;