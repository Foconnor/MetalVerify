import MagnetTest from '../features/magnet/magnetTest.jsx';
import PageLayout from '../components/layout/PageLayout.jsx';
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader.jsx";

function MagnetPage() {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <AppHeader />

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/Density")}>
          Previous Test
        </button>
        <button style={styles.button} onClick={() => navigate("/start-scan")}>
          Back to Selection
        </button>
        <button style={styles.button} onClick={() => navigate("/Ping")}>
          Ping Test
        </button>
        <button style={styles.button} onClick={() => navigate("/Density")}>
          Density Test
        </button>
      </div>

      <MagnetTest />
    </PageLayout>
  );
}

export default MagnetPage;

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