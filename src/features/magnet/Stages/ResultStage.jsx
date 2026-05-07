import { useState } from "react";
import MagnetTestResult from "../Animation/MagnetTestResult";

function ResultStage({ onResult }) {
    const [result, setResult] = useState("");

    const handleSave = () => {
        if (!result) return;

        let verdict = "";

        if (result === "slow") {
            verdict = "Highly Likely Genuine";
        }
        else if (result === "fast") {
            verdict = "Uncertain";
        }
        else if (result === "stick") {
            verdict = "Likely Fake";
        }

        onResult(verdict);
    };

    return (
        <div>
            <h2>What happened?</h2>

            <MagnetTestResult
                result={result}
                setResult={setResult}
            />

            {result && (
                <p style={{ marginTop: "20px" }}>
                    Result: <strong>{result}</strong>
                </p>
            )}

            <button
                onClick={handleSave}
                style={{ marginTop: "20px" }}
            >
                Save Result
            </button>
        </div>
    );
}

export default ResultStage;