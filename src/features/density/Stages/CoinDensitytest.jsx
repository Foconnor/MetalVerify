import { useState } from "react";
import { calculateCoinDensity } from "../DensityCalculations";

function CoinDensityTest({ selectedProfile, onCalculate, onHome }) {
    const [inputData, setInputData] = useState({
        diameter: "",
        thickness: "",
        weight: ""
    });

    const handleCoinChange = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        const density = calculateCoinDensity(
            inputData.diameter,
            inputData.thickness,
            inputData.weight
        );

        const expectedDensity =
            selectedProfile?.geometricDensity || 10.49;

        const deviation = Math.abs(
            density - expectedDensity
        );

        const confidence = Math.max(
            0,
            100 - (deviation / expectedDensity) * 100
        ).toFixed(2);

        let verdict = "Uncertain";

        if (confidence >= 85)
            verdict = "Likely Genuine";
        else if (confidence >= 60)
            verdict = "Possibly Genuine";
        else
            verdict = "Likely Fake";

        onCalculate({
            density,
            expectedDensity,
            confidence,
            verdict,
            inputs: inputData
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "400px",
                margin: "0 auto"
            }}
        >
            <h2>Coin Density Test</h2>

            <p>
                Testing:
                <strong> {selectedProfile?.name}</strong>
            </p>

            {/* Diameter */}
            <div className="form-row">
                <label className="form-label">
                    Diameter:
                </label>

                <input
                    type="number"
                    name="diameter"
                    value={inputData.diameter}
                    onChange={handleCoinChange}
                    className="form-input"
                />

                <span>cm</span>
            </div>

            {/* Thickness */}
            <div className="form-row">
                <label className="form-label">
                    Thickness:
                </label>

                <input
                    type="number"
                    name="thickness"
                    value={inputData.thickness}
                    onChange={handleCoinChange}
                    className="form-input"
                />

                <span>cm</span>
            </div>

            {/* Weight */}
            <div className="form-row">
                <label className="form-label">
                    Weight:
                </label>

                <input
                    type="number"
                    name="weight"
                    value={inputData.weight}
                    onChange={handleCoinChange}
                    className="form-input"
                />

                <span>g</span>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem"
                }}
            >
                <button onClick={handleSubmit}>
                    Calculate
                </button>
            </div>
        </div>
    );
}

export default CoinDensityTest;