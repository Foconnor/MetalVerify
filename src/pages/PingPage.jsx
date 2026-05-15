import PingTest from "../features/ping/Pingtest";
import PageLayout from "../components/layout/PageLayout.jsx";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader.jsx";

function PingPage() {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <AppHeader />

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/start-scan")}>
          Back to Selection
        </button>

        <button style={styles.button} onClick={() => navigate("/density")}>
          Density Test
        </button>
        <button style={styles.button} onClick={() => navigate("/magnet")}>
          Magnet Test
        </button>
      </div>

      <button style={styles.button} onClick={() => navigate("/density")}>
        Next Test
      </button>
      <h2>Ping Test</h2>
      <PingTest />
    </PageLayout>
  );
}

export default PingPage;

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