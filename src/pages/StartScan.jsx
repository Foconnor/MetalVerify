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
        <div>
            <h2>Start Scan</h2>

            <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="coin">Coin</option>
                <option value="bar">Bar</option>
            </select>

            <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
            >
                <option value="ping">Ping</option>
                <option value="density">Density</option>
                <option value="magnet">Magnet</option>
            </select>

            <select
                value={selectedItemId || ""}
                onChange={(e) => setSelectedItemId(e.target.value)}
            >
                {(selectedType === "coin" ? coins : bars).map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

            <label>
                <input
                    type="checkbox"
                    checked={enableThreeTest}
                    onChange={(e) => setEnableThreeTest(e.target.checked)}
                />
                Enable 3-Test Mode
            </label>

            <button onClick={handleStart}>Start</button>
        </div>
    );
}