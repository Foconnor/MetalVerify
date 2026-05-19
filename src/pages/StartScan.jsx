import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useThreeTest } from "../context/ThreeTestContext"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useTestStore } from "../context/TestStoreContext";
import { useAuth } from "../context/AuthContext";

export default function StartScan() {
    const navigate = useNavigate();
    const { startThreeTest } = useThreeTest();
    const { setSelectedItem } = useTestStore();
    const { user } = useAuth();
    const [coins, setCoins] = useState([]);
    const [bars, setBars] = useState([]);

    const [selectedItemId, setSelectedItemId] = useState(null);

    const [selectedType, setSelectedType] = useState(null); // coin | bar
    const [selectedTest, setSelectedTest] = useState(null); //ping | density | magnet
    
    const [enableThreeTest, setEnableThreeTest] = useState(false);


    const handleStart = () => {
        const selectedItem =
            selectedType === "coin"
                ? coins.find(c => c.id === selectedItemId)
                : bars.find(b => b.id === selectedItemId);

        setSelectedItem({
            type: selectedType,
            ...selectedItem
        });

         // 3-test flow takes priority
        if (enableThreeTest) {
            startThreeTest();
            navigate("/three-test-flow", {
                state: {
                    selectedItemId,
                    selectedTest,
                },
            });
            return;
        }

        navigate(`/${selectedTest}`);
    };

    const toggleThreeTest = () => {
        if (!user) {
            navigate("/login", {
                state: {
                    message: "Login to do Three-Test"
                }
            });
            return;
        }
        setEnableThreeTest(!enableThreeTest);
    };

    //fetch Bars
    useEffect(() => {
        async function fetchBars() {
            const snapshot = await getDocs(collection(db, "barProfiles"));
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBars(list);
        }

        fetchBars();
    }, []);

    //fetch Coins
    useEffect(() => {
        async function fetchCoins() {
            const snapshot = await getDocs(collection(db, "coinProfiles"));
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setCoins(list);

            if (list.length > 0) {
                setSelectedItemId(list[0].id);
            }
        }

        fetchCoins();
    }, []);

    useEffect(() => {
        if (selectedType === "coin" && coins.length > 0) {
            setSelectedItemId(coins[0].id);
        }

        if (selectedType === "bar" && bars.length > 0) {
            setSelectedItemId(bars[0].id);
        }
    }, [selectedType, coins, bars]);

    const resetTestSelection = () => {
        setSelectedTest(null);
        setSelectedType(null);
        setSelectedItemId(null);
    };

    const resetTypeSelection = () => {
        setSelectedType(null);
        setSelectedItemId(null);
    };

    return (
        <div style={styles.container}>
           
            {/* STEP 1: Select Test */}
            <div style={styles.section}>
                <p style={styles.stepTitle}>Step 1: Select Test</p>

                <div style={styles.buttonRow}>
                    <button
                        style={{
                            ...styles.optionButton,
                            ...(selectedTest === "ping" ? styles.selectedButton : {}),
                        }}
                        onClick={() => setSelectedTest("ping")}
                    >
                        Ping Test
                    </button>

                    <button
                        style={{
                            ...styles.optionButton,
                            ...(selectedTest === "density" ? styles.selectedButton : {}),
                        }}
                        onClick={() => setSelectedTest("density")}
                    >
                        Density Test
                    </button>

                    <button
                        style={{
                            ...styles.optionButton,
                            ...(selectedTest === "magnet" ? styles.selectedButton : {}),
                        }}
                        onClick={() => setSelectedTest("magnet")}
                    >
                        Magnet Test
                    </button>
                </div>
            </div>

            {/* STEP 2: Select Type (Coin or Bar) */}
            {selectedTest && (
                <div style={styles.section}>
                    <p style={styles.stepTitle}>Step 2: Select Item Type</p>
                    
                    <div style={styles.buttonRow}>
                        <button
                            style={{
                                ...styles.optionButton,
                                ...(selectedType === "coin" ? styles.selectedButton : {}),
                            }}
                            onClick={() => setSelectedType("coin")}
                        >
                            Coin
                        </button>

                        <button
                            style={{
                                ...styles.optionButton,
                                ...(selectedType === "bar" ? styles.selectedButton : {}),
                            }}
                            onClick={() => setSelectedType("bar")}
                        >
                            Bar
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Select Specific Item */}
            {selectedTest && selectedType && (
            <div style={styles.section}>
                <p style={styles.stepTitle}>
                    Step 3: Select {selectedType === "coin" ? "Coin" : "Bar"}
                </p>

                <select
                    style={styles.input}
                    value={selectedItemId || ""}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                >
                    {(selectedType === "coin" ? coins : bars).map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <button
                    style={{
                        ...styles.optionButton,
                        ...(enableThreeTest ? styles.selectedButton : {}),
                        backgroundColor: !user ? "#f57c00" : (enableThreeTest ? "#1d3557" : "#f1f1f1"),
                        color: !user ? "white" : (enableThreeTest ? "white" : "black")
                    }}
                    onClick={toggleThreeTest}
                >
                    {!user ? "Login to do Three-Test" : enableThreeTest ? "3-Test Mode: ON" : "Enable 3-Test Mode"}
                </button>

                <button style={styles.button} onClick={handleStart}>
                    Start Scan
                </button>
            </div>
            )}
        </div>
    );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "500px", // slightly wider so all 3 buttons fit comfortably
    margin: "0 auto",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "30px",
  },

  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#1d3557",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  },

  // Default style for all option buttons
  optionButton: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#f1f1f1",
    color: "black",
    fontSize: "18px",
    cursor: "pointer",
    flex: 1,              // makes all buttons equal width
    minWidth: "140px",    // ensures consistent sizing
    textAlign: "center",
  },

  // Style applied when button is selected
  selectedButton: {
    backgroundColor: "#1d3557",
    color: "white",
    boxShadow: "0 0 0 2px #0d1b2a",
  },

  // Makes the test buttons appear in one even horizontal row
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "nowrap",   // keeps all 3 buttons on the same line
    width: "100%",
  },

  stepTitle: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "10px",
  },
};