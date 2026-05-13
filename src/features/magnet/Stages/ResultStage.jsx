import { useState } from "react";
import MagnetTestResult from "../Animation/MagnetTestResult";
import { useNavigate } from "react-router-dom";


function ResultStage({ onResult }) {
    const [result, setResult] = useState("");
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();
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
            <button
                onClick={() =>
                    navigate("/inventory/add", {
                        state: {
                            testData: {
                                type: "magnet",
                                profileName:
                                selectedItem?.name,
                                result
                            }
                        }
                    })
                }
            >
                Add To Inventory
            </button>
        </div>
    );
}

export default ResultStage;