import PingTest from "../features/ping/Pingtest";
import PageLayout from "../components/layout/PageLayout.jsx";
import { useNavigate } from "react-router-dom";

function PingPage() {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <h1 style={styles.title}>Metal Verify</h1>

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/")}>
          Back to home
        </button>

        <button style={styles.button} onClick={() => navigate("/density")}>
          Density Test
        </button>
        <button style={styles.button} onClick={() => navigate("/magnet")}>
          Magnet Test
        </button>
      </div>

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