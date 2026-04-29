import { useState } from "react";
import MagnetTestResult from "../Animation/MagnetTestResult";

function ResultStage() {
  const [result, setResult] = useState("");

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
        Save Result (coming soon)
      </button>
    </div>
  );
}

export default ResultStage;