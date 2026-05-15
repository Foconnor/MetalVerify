import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { saveInventoryItem } from "../../firebase/saveInventoryItem";

export default function AddInventoryItem() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const testData = location.state?.testData || {};

    // Database profiles
    const [coins, setCoins] = useState([]);
    const [bars, setBars] = useState([]);
    const [selectedType, setSelectedType] = useState("coin");
    const [selectedProfileId, setSelectedProfileId] = useState("");

    // Form state
    const [form, setForm] = useState({
        inventoryId: "",
        type: "coin",
        description: testData.profileName || "",
        mintRefiner: "",
        weight: "",
        purity: ".999",
        quantity: "1",
        serialLot: "",
        yearDate: new Date().getFullYear().toString(),
        purchaseDate: new Date().toISOString().split('T')[0],
        costPerOz: "",
        totalCost: "",
        currency: "$",
        location: "",
        notes: "",
    });

    const [showAdditional, setShowAdditional] = useState(false);

    // Fetch coins and bars
    useEffect(() => {
        const fetchProfiles = async () => {
            const coinSnap = await getDocs(collection(db, "coinProfiles"));
            setCoins(coinSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const barSnap = await getDocs(collection(db, "barProfiles"));
            setBars(barSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchProfiles();
    }, []);

    // Auto-fill when profile is selected
    useEffect(() => {
        if (!selectedProfileId) return;

        const profiles = selectedType === "coin" ? coins : bars;
        const selected = profiles.find(p => p.id === selectedProfileId);

        if (selected) {
            setForm(prev => ({
                ...prev,
                description: selected.name || "",
                weight: selected.weight ? String(selected.weight) : "",
                type: selectedType,
            }));
        }
    }, [selectedProfileId, selectedType, coins, bars]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Auto calculate total cost
    useEffect(() => {
        if (form.costPerOz && form.quantity) {
            const total = (parseFloat(form.costPerOz) * parseFloat(form.quantity)).toFixed(2);
            setForm(prev => ({ ...prev, totalCost: total }));
        }
    }, [form.costPerOz, form.quantity]);

    const handleSave = async () => {
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            await saveInventoryItem({
                userId: user.uid,
                item: form
            });

            alert("Inventory item saved successfully!");
            navigate("/inventory");
        } catch (error) {
            console.error(error);
            alert("Failed to save inventory item.");
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
            <h1>Add To Inventory</h1>

            <button style={styles.button} onClick={() => navigate("/")}>
                Back to home
            </button>

            {/* Database Selector */}
            <div style={{ marginBottom: 20 }}>
                <label><strong>Select from Database</strong></label>
                <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
                    <button
                        onClick={() => setSelectedType("coin")}
                        style={{ padding: "10px 20px", background: selectedType === "coin" ? "#1e1e1e" : "#ddd", color: selectedType === "coin" ? "white" : "black", border: "none", borderRadius: 6 }}
                    >
                        Coins
                    </button>
                    <button
                        onClick={() => setSelectedType("bar")}
                        style={{ padding: "10px 20px", background: selectedType === "bar" ? "#1e1e1e" : "#ddd", color: selectedType === "bar" ? "white" : "black", border: "none", borderRadius: 6 }}
                    >
                        Bars
                    </button>
                </div>

                <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    style={{ width: "100%", padding: 12, borderRadius: 6 }}
                >
                    <option value="">— Select Coin or Bar —</option>
                    {(selectedType === "coin" ? coins : bars).map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Inventory ID */}
            <div style={{ marginBottom: 15 }}>
                <label>Inventory ID (e.g. COIN-2026-0147)</label>
                <input type="text" name="inventoryId" value={form.inventoryId} onChange={handleChange} style={styles.input} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 15 }}>
                <label>Description</label>
                <input type="text" name="description" value={form.description} onChange={handleChange} style={styles.input} />
            </div>

            {/* Mint / Refiner */}
            <div style={{ marginBottom: 15 }}>
                <label>Mint / Refiner</label>
                <input type="text" name="mintRefiner" value={form.mintRefiner} onChange={handleChange} style={styles.input} />
            </div>

            {/* Weight & Quantity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: 15 }}>
                <div>
                    <label>Weight (kg)</label>
                    <input type="number" name="weight" value={form.weight} onChange={handleChange} style={styles.input} min="1"/>
                </div>
                <div>
                    <label>Quantity</label>
                    <input type="number" name="quantity" value={form.quantity} onChange={handleChange} style={styles.input} min="1" />
                </div>
            </div>

            {/* Year */}
            <div style={{ marginBottom: 15 }}>
                <label>Year / Date</label>
                <input type="text" name="yearDate" value={form.yearDate} onChange={handleChange} style={styles.input} />
            </div>

            {/* Additional Details Button */}
            <button
                onClick={() => setShowAdditional(!showAdditional)}
                style={styles.advancedButton}
            >
                {showAdditional ? "Hide Additional Details ▼" : "Show Additional Details ▶"}
            </button>

            {showAdditional && (
                <div style={{ marginTop: 20, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
                    <div style={{ marginBottom: 15 }}>
                        <label>Purchase Date</label>
                        <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                        <select
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc", width: "80px" }}
                        >
                            <option value="$">$ USD</option>
                            <option value="£">£ GBP</option>
                            <option value="€">€ EUR</option>
                        </select>

                        <div style={{ flex: 1 }}>
                            <label>Cost per oz</label>
                            <input type="number" step="0.01" name="costPerOz" value={form.costPerOz} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Total Cost</label>
                        <input type="number" step="0.01" name="totalCost" value={form.totalCost} readOnly style={styles.input} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Serial / Lot #</label>
                        <input type="text" name="serialLot" value={form.serialLot} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Location</label>
                        <input type="text" name="location" value={form.location} onChange={handleChange} style={styles.input} placeholder="Safe A - Shelf 2" />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Notes</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} style={styles.textarea} />
                    </div>
                </div>
            )}

            <button onClick={handleSave} style={styles.saveButton}>
                Save to Inventory
            </button>
        </div>
    );
}

const styles = {
    input: {
        width: "100%",
        padding: 10,
        marginTop: 5,
        borderRadius: 6,
        border: "1px solid #ccc"
    },
    textarea: {
        width: "100%",
        padding: 10,
        marginTop: 5,
        minHeight: 100,
        borderRadius: 6,
        border: "1px solid #ccc"
    },
    saveButton: {
        marginTop: 30,
        width: "100%",
        padding: 14,
        border: "none",
        borderRadius: 8,
        backgroundColor: "#1e1e1e",
        color: "white",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: "bold"
    },
    advancedButton: {
        margin: "15px 0",
        padding: "10px 16px",
        borderRadius: 6,
        border: "1px solid #ccc",
        background: "white",
        cursor: "pointer"
    }
};