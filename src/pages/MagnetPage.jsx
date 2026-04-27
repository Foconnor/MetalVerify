import MagnetTest from '../features/magnet/magnetTest.jsx';
import PageLayout from '../components/layout/PageLayout.jsx';
import { useNavigate } from "react-router-dom";

function MagnetPage() {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <h1 style={styles.title}>Metal Verify</h1>

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/")}>
          Back
        </button>

        <button style={styles.button} onClick={() => navigate("/ping")}>
          Next Test
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