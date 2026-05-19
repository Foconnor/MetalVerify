import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "../../../context/TestStoreContext";
import { useAuth } from "../../../context/AuthContext";   // ← Added

import MagnetTestResult from "../Animation/MagnetTestResult";

function ResultStage({ onResult }) {
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();
    const { user } = useAuth();                     // ← Added

    const [result, setResult] = useState("");

    const handleSave = () => {
        if (!user) {
            // Redirect to login and remember where to go after
            navigate("/login", {
            });
        }
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
        const testData = {
            type: "magnet",
            profileName: selectedItem?.name || "Unknown Item",
            result: result,
            confidence: result === "slow" ? 85 : result === "fast" ? 50 : 30,
        };

        if (!user) {
            // Redirect to login and remember where to go after
            navigate("/login", {
                state: {
                    from: "/inventory/add",
                    testData: testData
                }
            });
        } else {
            // User is logged in → go directly to inventory
            navigate("/inventory/add", {
                state: { testData: testData }
            });
        }
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
                    {user ? "Save Result to History" : "Login to Save to History"}
                </button>

                <button
                    onClick={handleAddToInventory}
                    style={{ backgroundColor: "#1e88e5", color: "white" }}
                >
                    {user ? "Add To Inventory" : "Login to Save to Inventory"}
                </button>
            </div>
        </div>
    );
}

export default ResultStage;