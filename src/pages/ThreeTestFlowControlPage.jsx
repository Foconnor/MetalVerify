import PageLayout from "../components/layout/PageLayout.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";

//tests
import PingTest from "../features/ping/Pingtest.jsx";
import DensityTest from "../features/density/DensityTest.jsx";
import MagnetTest from "../../features/magnet/MagnetTest";

import { useNavigate, useLocation } from "react-router-dom";

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

    const currentTest = location.state?.selectedTest || "ping";
    const selectedItemId = location.state?.selectedItemId;
    
    const currentTestIndex = testOrder.indexOf(currentTest);
    const CurrentTestComponent = testComponents[currentTest];

    const isLastTest = currentTestIndex === testOrder.length - 1;
    
    const handleNextTest = () => {
        const nextIndex = (currentTestIndex + 1) % testOrder.length;
        const nextTest = testOrder[nextIndex];

        navigate("/three-test-flow", {
        state: {
            selectedTest: nextTest,
            selectedItemId,
        },
        replace: true,
        });
    };

    const handleSaveResults = () => {
        // you’ll implement DB save later
        console.log("Saving results...");
    };

    return (
        <PageLayout>
            <AppHeader />
            <h2>3-Test Flow Control</h2>

            {/* BUTTONS */}
            <div style={styles.buttonContainer}>
                <button
                style={styles.button}
                onClick={() => navigate("/start-scan")}
                >
                Back to Scan Selection
                </button>

                <button
                style={styles.button}
                onClick={handleNextTest}
                >
                Next Test
                </button>

                {isLastTest && (
                <button
                    style={{
                    ...styles.button,
                    backgroundColor: "green",
                    }}
                    onClick={handleSaveResults}
                >
                    Save Results
                </button>
                )}
            </div>

            {/* CURRENT TEST DISPLAY */}
            <div style={styles.testBox}>
                {CurrentTestComponent ? (
                <CurrentTestComponent selectedItemId={selectedItemId} />
                ) : (
                <p>Unknown test selected</p>
                )}
            </div>
        </PageLayout>
    );
}

export default ThreeTestFlowControlPage;