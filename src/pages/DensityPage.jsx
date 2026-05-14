import DensityTest from "../features/density/DensityTest.jsx";
import PageLayout from "../components/layout/PageLayout.jsx";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader.jsx";

function DensityPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <AppHeader />

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/start-scan")}>
          Back to Selection
        </button>

        <button style={styles.button} onClick={() => navigate("/ping")}>
          Ping Test
        </button>
        <button style={styles.button} onClick={() => navigate("/magnet")}>
          Magnet Test
        </button>
      </div>

      <h2>Density Test</h2>
      <DensityTest />
    </PageLayout>
  );
}

export default DensityPage;

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