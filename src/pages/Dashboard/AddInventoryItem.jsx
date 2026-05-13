import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { saveInventoryItem } from "../../firebase/saveInventoryItem";

export default function AddInventoryItem() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const testData = location.state?.testData || {};

    const [form, setForm] = useState({
        inventoryId: "",           // e.g. COIN-2026-0147
        type: "coin",              // Coin, Round, Bar
        description: testData.profileName || "",
        mintRefiner: "",
        weight: "",
        purity: ".999",
        quantity: "1",
        serialLot: "",
        yearDate: "",
        purchaseDate: "",
        costPerOz: "",
        totalCost: "",
        location: "",
        notes: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            <h1>Add to Inventory</h1>

            <div style={{ marginBottom: 15 }}>
                <label>Name/Inventory ID</label>
                <input
                    type="text"
                    name="inventoryId"
                    value={form.inventoryId}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Name/Inventory ID"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                    <option value="coin">Coin</option>
                    <option value="bar">Bar</option>
                </select>
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="2024 American Silver Eagle"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Mint / Refiner</label>
                <input
                    type="text"
                    name="mintRefiner"
                    value={form.mintRefiner}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="U.S. Mint / Geiger"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Weight</label>
                <input
                    type="text"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="1 oz or 10 oz"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Purity</label>
                <input
                    type="text"
                    name="purity"
                    value={form.purity}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder=".999 or .9999"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Serial / Lot #</label>
                <input
                    type="text"
                    name="serialLot"
                    value={form.serialLot}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Year / Date</label>
                <input
                    type="text"
                    name="yearDate"
                    value={form.yearDate}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="2024"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Purchase Date (YYYY-MM-DD)</label>
                <input
                    type="date"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Cost per oz ($)</label>
                <input
                    type="number"
                    step="0.01"
                    name="costPerOz"
                    value={form.costPerOz}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Total Cost ($)</label>
                <input
                    type="number"
                    step="0.01"
                    name="totalCost"
                    value={form.totalCost}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Safe A - Shelf 2"
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label>Notes</label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Any additional information..."
                />
            </div>

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
        marginTop: 25,
        width: "100%",
        padding: 14,
        border: "none",
        borderRadius: 8,
        backgroundColor: "#1e1e1e",
        color: "white",
        cursor: "pointer",
        fontSize: 16
    }
};