import PageLayout from "../components/layout/PageLayout.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";

// Tests
import PingTest from "../features/ping/Pingtest.jsx";
import DensityTest from "../features/density/DensityTest.jsx";
import MagnetTest from "../features/magnet/MagnetTest";

import { useNavigate, useLocation } from "react-router-dom";
import { useTestStore } from "../context/TestStoreContext";   // For selected item persistence

const styles = {
    title: {
        textAlign: "center",
        marginBottom: "30px",
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "40px",
        gap: "10px",
        flexWrap: "wrap",
    },

    button: {
        flex: 1,
        padding: "15px",
        fontSize: "16px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#1e1e1e",
        color: "white",
        minWidth: "140px",
    },
};

const testOrder = ["ping", "density", "magnet"];
const testComponents = {
    ping: PingTest,
    density: DensityTest,
    magnet: MagnetTest,
};

function ThreeTestFlowControlPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedItem } = useTestStore();   // Get persisted selected item

    const currentTest = location.state?.selectedTest || "ping";
    const currentTestIndex = testOrder.indexOf(currentTest);
    const CurrentTestComponent = testComponents[currentTest];

    const isLastTest = currentTestIndex === testOrder.length - 1;

    const handleNextTest = () => {
        const nextIndex = (currentTestIndex + 1) % testOrder.length;
        const nextTest = testOrder[nextIndex];

        navigate("/three-test-flow", {
            state: {
                selectedTest: nextTest,
            },
            replace: true,
        });
    };

    const handleBackToSelection = () => {
        navigate("/start-scan");
    };

    return (
        <PageLayout>
            <AppHeader />

            <h2 style={styles.title}>3-Test Flow</h2>

            {/* Progress Indicator */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p>
                    Test {currentTestIndex + 1} of 3 — <strong>{currentTest.toUpperCase()}</strong>
                </p>
                <div style={{
                    height: 8,
                    background: "#ddd",
                    borderRadius: 4,
                    overflow: "hidden",
                    maxWidth: "300px",
                    margin: "10px auto"
                }}>
                    <div style={{
                        height: "100%",
                        width: `${((currentTestIndex + 1) / 3) * 100}%`,
                        background: "linear-gradient(to right, #4caf50, #2196f3)",
                        transition: "width 0.4s"
                    }} />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={handleBackToSelection}>
                    ← Change Selection
                </button>

                {!isLastTest && (
                    <button style={styles.button} onClick={handleNextTest}>
                        Next Test →
                    </button>
                )}

                {isLastTest && (
                    <button
                        style={{
                            ...styles.button,
                            backgroundColor: "#4caf50",
                        }}
                        onClick={() => navigate("/three-test-result")}
                    >
                        Finish & See Results
                    </button>
                )}
            </div>

            {/* Current Test */}
            <div style={{ marginTop: "20px" }}>
                {CurrentTestComponent ? (
                    <CurrentTestComponent />
                ) : (
                    <p>Unknown test selected</p>
                )}
            </div>

            {/* Show selected item for debugging / user awareness */}
            {selectedItem && (
                <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
                    Testing: <strong>{selectedItem.name}</strong>
                </p>
            )}
        </PageLayout>
    );
}

export default ThreeTestFlowControlPage;