import { useState } from "react";
import InfoStage from "./Stages/InfoStage.jsx";
import TestStage from "../magnet/Stages/TestStage.jsx";
import ResultStage from "../magnet/Stages/ResultStage.jsx";

import { saveMagnetTest } from "../Account/DatabaseCode";
import { saveScan } from "../../firebase/saveScan";

import { useThreeTest } from "../../context/ThreeTestContext";
import { useTestStore } from "../../context/TestStoreContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MagnetTest() {
    const { threeTestMode, testsRemaining } = useThreeTest();
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();
    const { registerTest } = useThreeTest();
    const { user } = useAuth();
    const [inventoryId, setInventoryId] = useState(null);

    const [step, setStep] = useState(1);

    const [result, setResult] = useState(null);

    const next = () => setStep(prev => prev + 1);
    const back = () => setStep(prev => prev - 1);

    const handleResult = async (verdict) => {

        let confidence = 0;

        if (verdict === "Highly Likely Genuine") {
            confidence = 90;
        }
        else if (verdict === "Uncertain") {
            confidence = 50;
        }
        else {
            confidence = 20;
        }

        const result = registerTest();

        const activeThreeTestId = result?.threeTestId;
        const completed = result?.completed;

        const testData = {
            itemType: selectedItem?.type || "coin",

            profileName: selectedItem?.name || "Unknown",

            results: {
                confidence,
                verdict
            },

            label: selectedItem?.label || "",
            threeTestId: activeThreeTestId || null,
            inventoryId
        };

        // save to tests collection
        await saveMagnetTest(testData);

        // save to scan history
        if (user) {
            await saveScan({
                userId: user.uid,
                testType: "magnet",
                metalType: selectedItem?.type || "coin",
                profileName: selectedItem?.name || "Unknown",
                result: verdict,
                confidence,
                label: selectedItem?.label || "",
                threeTestId: activeThreeTestId || null,
                inventoryId
            });
        }

        setResult(verdict);
        if (completed && activeThreeTestId) {
            navigate(`/three-test-result/${activeThreeTestId}`);
        }
    };

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center"
            }}
        >
            <h1>Magnet Test</h1>
            {threeTestMode && (
                <div style={{ marginBottom: 20, textAlign: "center" }}>
                    <p><strong>3-Test Mode Active</strong> — {testsRemaining} remaining</p>
                    <div style={{ height: 8, background: "#ddd", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                            height: "100%",
                            width: `${((3 - testsRemaining) / 3) * 100}%`,
                            background: "linear-gradient(to right, #4caf50, #2196f3)",
                            transition: "width 0.4s"
                        }} />
                    </div>
                </div>
            )}



            {selectedItem && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                    }}
                >
                    <p>
                        <strong>Selected Item:</strong> {selectedItem.name}
                    </p>

                    <p>
                        <strong>Type:</strong> {selectedItem.type}
                    </p>
                </div>
            )}

            <p>Step {step} of 3</p>

            {step === 1 && <InfoStage />}

            {step === 2 && <TestStage />}

            {step === 3 && (
                <ResultStage
                    onResult={handleResult}
                    result={result}
                />
            )}

            <div style={{ marginTop: "20px" }}>
                {step > 1 && (
                    <button onClick={back}>
                        Back
                    </button>
                )}

                {step < 3 && (
                    <button
                        onClick={next}
                        style={{ marginLeft: "10px" }}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default MagnetTest;