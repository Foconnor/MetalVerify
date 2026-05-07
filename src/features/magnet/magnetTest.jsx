import { useState } from "react";
import InfoStage from "./Stages/InfoStage.jsx";
import TestStage from "../magnet/Stages/TestStage.jsx";
import ResultStage from "../magnet/Stages/ResultStage.jsx";

import { saveMagnetTest } from "../Account/DatabaseCode";
import { saveScan } from "../../firebase/saveScan";

import { useThreeTest } from "../../context/ThreeTestContext";
import { useTestStore } from "../../context/TestStoreContext";
import { useAuth } from "../../context/AuthContext";

function MagnetTest() {
    const { selectedItem } = useTestStore();
    const { registerTest } = useThreeTest();
    const { user } = useAuth();

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

        const activeThreeTestId = registerTest();

        const testData = {
            itemType: selectedItem?.type || "coin",

            profileName: selectedItem?.name || "Unknown",

            results: {
                confidence,
                verdict
            },

            label: selectedItem?.label || "",
            threeTestId: activeThreeTestId || null
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
                threeTestId: activeThreeTestId || null
            });
        }

        setResult(verdict);
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