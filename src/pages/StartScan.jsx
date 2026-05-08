import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useThreeTest } from "../context/ThreeTestContext"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useTestStore } from "../context/TestStoreContext";

export default function StartScan() {
    const navigate = useNavigate();
    const { startThreeTest } = useThreeTest();
    const { setSelectedItem } = useTestStore();
    const [coins, setCoins] = useState([]);
    const [bars, setBars] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedType, setSelectedType] = useState("coin");const [selectedTest, setSelectedTest] = useState("ping");
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

        if (enableThreeTest) startThreeTest();

        navigate(`/${selectedTest}`);
    };

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

    return (
        <div style={styles.container}>
            <h3 > Select Item to Test</h3>

            <select
                style={styles.input}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="coin">Coin</option>
                <option value="bar">Bar</option>
            </select>

            <select
                style={styles.input}
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
            >
                <option value="ping">Ping Test</option>
                <option value="density">Density Test</option>
                <option value="magnet">Magnet Test</option>
            </select>

            <select
                style={styles.input}
                value={selectedItemId || ""}
                onChange={(e) => setSelectedItemId(e.target.value)}
            >
                {(selectedType === "coin" ? coins : bars).map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

            <label style={styles.checkbox}>
                <input
                    type="checkbox"
                    checked={enableThreeTest}
                    onChange={(e) => setEnableThreeTest(e.target.checked)}
                />
                Enable 3-Test Mode
            </label>

            <button style={styles.button} onClick={handleStart}>
                Start Scan
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "400px",
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
};