import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "../../../context/TestStoreContext";
import { useAuth } from "../../../context/AuthContext";

function CoinDensityResult({ data, onReset }) {
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();
    const { user } = useAuth();

    const [barPosition, setBarPosition] = useState(50);

    const calculateBarPosition = (density) => {
        const EXPECTED = data.expectedDensity || 10.49;
        const MAX_RANGE = 2;
        const deviation = parseFloat(density) - EXPECTED;
        const position = 50 + (deviation / MAX_RANGE) * 50;
        return Math.min(100, Math.max(0, position));
    };

    useEffect(() => {
        if (data.density !== null) {
            const position = calculateBarPosition(data.density);
            setBarPosition(position);
        }
    }, [data.density]);

    const handleAddToInventory = () => {
        const testData = {
            type: "density",
            profileName: selectedItem?.name || data.description || "Unknown Coin",
            result: data.verdict || "Uncertain",
            confidence: data.confidence || 0,
        };

        if (!user) {
            navigate("/login", {
                state: {
                    from: "/inventory/add",
                    testData: testData
                }
            });
        } else {
            navigate("/inventory/add", {
                state: { testData: testData }
            });
        }
    };

    return (
        <div>
            <h2>Coin Results</h2>

            <div style={{
                marginTop: "1rem",
                width: "260px",
                margin: "0 auto",
                textAlign: "center"
            }}>
                {/* Gradient bar */}
                <div style={{
                    position: "relative",
                    height: "14px",
                    borderRadius: "8px",
                    background: "linear-gradient(to right, red, yellow, green, yellow, red)"
                }}>
                    <div style={{
                        position: "absolute",
                        top: "-4px",
                        left: `calc(${barPosition}% - 2px)`,
                        width: "4px",
                        height: "22px",
                        backgroundColor: "#0c0a0a"
                    }} />
                </div>

                {/* Labels */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    marginTop: "4px",
                    color: "#ccc"
                }}>
                    <span>LOW</span>
                    <span>PERFECT</span>
                    <span>HIGH</span>
                </div>

                <p>
                    Density: <strong>{data.density}</strong>
                </p>

                <p>
                    Expected: <strong>{data.expectedDensity}</strong>
                </p>

                <p style={{ marginTop: "0.5rem" }}>
                    Confidence: <strong style={{ fontSize: "2rem" }}>{data.confidence}%</strong>
                </p>

                <h3>{data.verdict}</h3>
            </div>

            <div style={{ marginTop: "25px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={onReset}>Test Again</button>

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

export default CoinDensityResult;