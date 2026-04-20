import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentDensityTests } from "../../features/Account/DatabaseCode.js"; 

function Dashboard({ onNavigate }) {
  const [recentTests, setRecentTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tests = await getRecentDensityTests();
        //order by timestamp desc and take only 3
        tests.sort((a, b) => b.createdAt - a.createdAt);
        setRecentTests(tests.slice(0, 3)); // only last 3
        // console.log("Fetched recent tests:", tests);
      } catch (err) {
        console.error("Error fetching recent tests:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* TEST BUTTONS */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/ping")}>
          Ping Test
        </button>

        <button style={styles.button} onClick={() => navigate("/density")}>
          Density Test
        </button>

        <button style={styles.button} onClick={() => navigate("/magnet")}>
          Magnet Test
        </button>
      </div>

      {/* RECENT TESTS */}
      <div style={styles.recentContainer}>
        <h2>Recent Scans</h2>

        {recentTests.length === 0 ? (
          <p>No recent tests yet.</p>
        ) : (
            <>
                <div style={styles.cardsGrid}>
                    {recentTests.map((test, index) => (
                        <div key={index} style={styles.testCard}>
                            <p><strong>Test:</strong> {test.type}</p>
                            <p><strong>Type:</strong> {test.itemType}</p>
                            <p><strong>Confidence:</strong> {test.results.confidence}%</p>
                            <p style={styles.date}>
                                {test.createdAt ? new Date(test.createdAt.seconds * 1000).toLocaleString() : "Unknown date"}
                            </p>
                        </div>
                    ))}
                </div>
            </>
        )}

        <div style={styles.historyButtonContainer}>
          <button style={styles.historyButton} onClick={() => navigate("/history")}>
            View History
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },

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

  recentContainer: {
    marginTop: "20px",
  },

  testCard: {
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f5f5f5",
    marginBottom: "10px",
  },

  date: {
    fontSize: "12px",
    color: "gray",
  },
  
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  historyButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
  historyButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1e1e1e",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
},
};