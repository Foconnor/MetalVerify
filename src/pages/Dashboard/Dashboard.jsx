import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentDensityTests } from "../../features/Account/DatabaseCode.js"; 
import { useAuth } from "../../context/AuthContext.jsx";
import Accounts from "../../features/Account/Accounts.jsx";
import PageLayout from "../../components/layout/PageLayout.jsx";
import { useThreeTest } from "../../context/ThreeTestContext";
import AppHeader from "../../components/layout/AppHeader.jsx";


function Dashboard({ onNavigate }) {
  const [recentTests, setRecentTests] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    threeTestMode,
    testsRemaining,
    startThreeTest
  } = useThreeTest();
 const [silverPrice, setSilverPrice] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const generateThreeTestId = () => {
    return "3test_" + Date.now();
  };

  useEffect(() => {
    

    if (user) {
      fetchData();
    }
  }, []);

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


  return (
    <PageLayout>
      <AppHeader />

      {/*<button onClick={startThreeTest} disabled={threeTestMode}>*/}
      {/*  Start 3-Test Mode*/}
      {/*</button>*/}

      {/*{threeTestMode && (*/}
      {/*    <p>3-Test Active ({testsRemaining} remaining)</p>*/}
      {/*)}*/}

      {/* TEST BUTTONS */}
      {/*<div style={styles.buttonContainer}>*/}
      {/*  <button style={styles.button} onClick={() => navigate("/ping")}>*/}
      {/*    Ping Test*/}
      {/*  </button>*/}

      {/*  <button style={styles.button} onClick={() => navigate("/density")}>*/}
      {/*    Density Test*/}
      {/*  </button>*/}

      {/*  <button style={styles.button} onClick={() => navigate("/magnet")}>*/}
      {/*    Magnet Test*/}
      {/*  </button>*/}
      {/*</div>*/}
      <button style={styles.button} onClick={() => navigate("/start-scan")}>
        Start Scan
      </button>

      {/* RECENT SCANS */}
        {user ? (
          <div style={styles.recentContainer}>
            <h2>Recent Scans</h2>

            {recentTests.length === 0 ? (
                <p>No tests yet.</p>
            ) : (
                <div style={styles.cardsGrid}>
                  {recentTests.map((test, i) => (
                      <div key={i} style={styles.testCard}>
                        <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 8px 0" }}>
                          {test.type.toUpperCase()} TEST
                        </p>

                        <h4 style={{ margin: "5px 0 8px 0" }}>
                          {test.profileName || test.itemType || "Unknown Item"}
                        </h4>

                        {test.results?.verdict && (
                            <p style={{
                              fontWeight: "bold",
                              color: test.results.confidence >= 70 ? "green" :
                                  test.results.confidence >= 50 ? "orange" : "red",
                              margin: "6px 0"
                            }}>
                              {test.results.verdict}
                            </p>
                        )}

                        <p style={{ margin: "4px 0" }}>
                          Confidence: <strong>{test.results?.confidence || test.confidence || "—"}%</strong>
                        </p>

                        {test.createdAt && (
                            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "8px" }}>
                              {new Date(test.createdAt.seconds * 1000).toLocaleDateString()}
                            </p>
                        )}
                      </div>
                  ))}
                </div>
            )}
            <button onClick={() => navigate("/history")} style={styles.button}>
              View History
            </button>
            <button
                style={styles.button}
                onClick={() => navigate("/inventory")}
            >
              Inventory
            </button>
          </div>
        ) : (
          <div style={styles.recentContainer}>
            <h2>Recent Scans</h2>
            <p>Log in to save your scans.</p>
            <button onClick={() => navigate("/login")} style={styles.button}>
              Log In
            </button>
          </div>
        )}
      </PageLayout>
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
    margin : "0 5px",
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
pageWrapper: {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  padding: "20px",
  flexWrap: "wrap", // KEY for mobile
},

/* LEFT */
newsContainer: {
  flex: "1",
  minWidth: "250px",
  maxWidth: "300px",
  backgroundColor: "#f5f5f5",
  padding: "15px",
  borderRadius: "10px",
},

newsCard: {
  marginBottom: "10px",
},

newsSource: {
  fontSize: "12px",
  color: "gray",
},

/* MIDDLE */
mainContainer: {
  flex: "2",
  minWidth: "300px",
},

/* RIGHT */
sponsorContainer: {
  flex: "1",
  minWidth: "200px",
  maxWidth: "250px",
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "10px",
},

sponsorCard: {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
},

sponsorButton: {
  marginTop: "8px",
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#1e1e1e",
  color: "white",
  cursor: "pointer",
},
accountFloating: {
  position: "fixed",   // 🔑 this is what makes it stay put
  top: "20px",
  right: "20px",
  zIndex: 1000,
  
  backgroundColor: "white",
  padding: "10px 15px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
},
};