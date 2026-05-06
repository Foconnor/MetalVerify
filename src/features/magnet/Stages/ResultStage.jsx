import { useState } from "react";
import MagnetTestResult from "../Animation/MagnetTestResult";
import { saveMagnetTest } from '../../Account/DatabaseCode.js';
import { getAuth } from "firebase/auth";

function ResultStage() {
  const [result, setResult] = useState("");

  const handleUpload = () => {
    // Saving to database
    saveMagnetTest({ result });
  };

  return (
    <div>
      <h2>What happened?</h2>

      <MagnetTestResult result={result} setResult={setResult} />

      {/* <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => setResult("slow")}>Slow Slide</button>
        <button onClick={() => setResult("fast")}>Fast Drop</button>
        <button onClick={() => setResult("stick")}>Sticks</button>
      </div> */}

      {result && (
        <p style={{ marginTop: "20px" }}>
          Result: <strong>{result}</strong>
        </p>
      )}

      <button style={{ marginTop: "20px" }}>
        Save Result
      </button>
    </div>
  );
}

export default ResultStage;