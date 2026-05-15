import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "../../../context/TestStoreContext";
import { useAuth } from "../../../context/AuthContext";

function BarDensityResult({ data, onReset }) {
    const navigate = useNavigate();
    const { selectedItem } = useTestStore();
    const { user } = useAuth();

    const [barPosition, setBarPosition] = useState(50);

    const calculateBarPosition = (density) => {
        const EXPECTED = data.selectedBarData?.expectedDensity || 10.49;
        const MAX_RANGE = 2;
        const deviation = parseFloat(density) - EXPECTED;
        const position = 50 + (deviation / MAX_RANGE) * 50;
        return Math.min(100, Math.max(0, position));
    };

    const getResultVerdict = (confidence) => {
        if (confidence >= 90) return "Highly Likely Genuine";
        if (confidence >= 70) return "Likely Genuine";
        if (confidence >= 50) return "Uncertain";
        if (confidence >= 30) return "Likely Fake";
        return "Very Likely Fake";
    };

    const handleUpload = () => {
        // Your existing save logic...
        if (user) {
            const testData = {
                itemType: "bar",
                profileName: data.selectedBarData ? data.selectedBarData.name : "Unknown Profile",
                metrics: {
                    length: parseInt(data.input?.length || 0),
                    width: parseInt(data.input?.width || 0),
                    height: parseInt(data.input?.height || 0),
                    weight: parseFloat(data.input?.weight || 0),
                    density: parseFloat(data.results?.density || 0)
                },
                results: {
                    confidence: parseInt(data.results?.confidence || 0),
                    verdict: getResultVerdict(data.results?.confidence || 0)
                }
            };

            // ... your saveDensityTest and saveScan calls
        }
    };

    // Calculate bar position
    useEffect(() => {
        if (data.results?.density) {
            const position = calculateBarPosition(data.results.density);
            setBarPosition(position);
        }
    }, [data.results?.density]);

    const handleAddToInventory = () => {
        const testData = {
            type: "density",
            profileName: selectedItem?.name || data.selectedBarData?.name || "Unknown Bar",
            result: getResultVerdict(data.results?.confidence || 0),
            confidence: data.results?.confidence || 0,
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
            <h2>Bar Results</h2>

            {data.results?.confidence !== null && (
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

                    <p style={{ marginTop: "0.5rem" }}>
                        Confidence: <strong style={{ fontSize: "2.8rem" }}>
                        {data.results.confidence}%
                    </strong>
                    </p>
                </div>
            )}

            <div style={{ marginTop: "25px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={onReset}>Test Again</button>
                <button onClick={handleUpload}>Save Result</button>
                <button
                    onClick={handleAddToInventory}
                    style={{ backgroundColor: "#1e88e5", color: "white" }}
                >
                    {user ? "Add To Inventory" : "Login to Save"}
                </button>
            </div>
        </div>
    );
}

export default BarDensityResult;