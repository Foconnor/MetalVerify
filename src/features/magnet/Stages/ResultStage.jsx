import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "../../../context/TestStoreContext";   // ← FIXED PATH

import MagnetTestResult from "../Animation/MagnetTestResult";

function ResultStage({ onResult }) {
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();

    const [result, setResult] = useState("");

    const handleSave = () => {
        if (!result) return;

        let verdict = "";

        if (result === "slow") {
            verdict = "Highly Likely Genuine";
        } else if (result === "fast") {
            verdict = "Uncertain";
        } else if (result === "stick") {
            verdict = "Likely Fake";
        }

        onResult(verdict);
    };

    const handleAddToInventory = () => {
        navigate("/inventory/add", {
            state: {
                testData: {
                    type: "magnet",
                    profileName: selectedItem?.name || "Unknown Item",
                    result: result,
                    confidence: result === "slow" ? 85 : result === "fast" ? 50 : 30,
                }
            }
        });
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

            <div style={{ marginTop: "25px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={handleSave}>
                    Save Result
                </button>

                <button
                    onClick={handleAddToInventory}
                    style={{ backgroundColor: "#1e88e5", color: "white" }}
                >
                    Add To Inventory
                </button>
            </div>
        </div>
    );
}

export default ResultStage;