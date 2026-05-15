import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { uploadCoinProfiles, uploadBarProfiles } from "../firebase/firestoreUpload";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("coins");
    const [coins, setCoins] = useState([]);
    const [bars, setBars] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: "",
        idealFreq: "",
        tolerance: "",
        minDuration: "",
        weight: "",
        diameter: "",
        thickness: "",
        expectedDensity: "",
    });

    // Fetch data
    useEffect(() => {
        fetchCoins();
        fetchBars();
    }, []);

    const fetchCoins = async () => {
        const snapshot = await getDocs(collection(db, "coinProfiles"));
        setCoins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchBars = async () => {
        const snapshot = await getDocs(collection(db, "barProfiles"));
        setBars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({
            name: "", idealFreq: "", tolerance: "", minDuration: "",
            weight: "", diameter: "", thickness: "", expectedDensity: ""
        });
        setEditingItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const collectionName = activeTab === "coins" ? "coinProfiles" : "barProfiles";

        try {
            if (editingItem) {
                // Update
                await updateDoc(doc(db, collectionName, editingItem.id), form);
                alert("Item updated successfully!");
            } else {
                // Create
                await addDoc(collection(db, collectionName), form);
                alert("Item added successfully!");
            }

            resetForm();
            setShowForm(false);
            activeTab === "coins" ? fetchCoins() : fetchBars();
        } catch (error) {
            console.error(error);
            alert("Failed to save item.");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setForm(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;

        const collectionName = activeTab === "coins" ? "coinProfiles" : "barProfiles";
        try {
            await deleteDoc(doc(db, collectionName, id));
            alert("Item deleted.");
            activeTab === "coins" ? fetchCoins() : fetchBars();
        } catch (error) {
            console.error(error);
            alert("Failed to delete.");
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
            <h1>Admin Dashboard</h1>

            <div style={{ margin: "20px 0" }}>
                <button onClick={uploadCoinProfiles} style={{ marginRight: 10 }}>
                    Upload Default Coins
                </button>
                <button onClick={uploadBarProfiles}>
                    Upload Default Bars
                </button>
            </div>

            <div style={{ marginBottom: 20 }}>
                <button onClick={() => { setActiveTab("coins"); setShowForm(false); }}
                        style={{ padding: "10px 20px", marginRight: 10, background: activeTab === "coins" ? "#1e1e1e" : "#ddd", color: activeTab === "coins" ? "white" : "black" }}>
                    Coins
                </button>
                <button onClick={() => { setActiveTab("bars"); setShowForm(false); }}
                        style={{ padding: "10px 20px", background: activeTab === "bars" ? "#1e1e1e" : "#ddd", color: activeTab === "bars" ? "white" : "black" }}>
                    Bars
                </button>
            </div>

            <button
                onClick={() => { resetForm(); setShowForm(true); }}
                style={{ padding: "12px 24px", background: "#4caf50", color: "white", border: "none", borderRadius: 8, marginBottom: 20 }}
            >
                + Add New {activeTab === "coins" ? "Coin" : "Bar"}
            </button>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: "#f9f9f9", padding: 25, borderRadius: 12, marginBottom: 30 }}>
                    <h3>{editingItem ? "Edit" : "Add New"} {activeTab === "coins" ? "Coin" : "Bar"}</h3>

                    <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" style={styles.input} required />
                    <input name="idealFreq" type="number" value={form.idealFreq} onChange={handleInputChange} placeholder="Ideal Frequency" style={styles.input} required />
                    <input name="tolerance" type="number" value={form.tolerance} onChange={handleInputChange} placeholder="Tolerance" style={styles.input} required />
                    <input name="minDuration" type="number" step="0.1" value={form.minDuration} onChange={handleInputChange} placeholder="Min Duration" style={styles.input} required />
                    <input name="weight" type="number" value={form.weight} onChange={handleInputChange} placeholder="Weight (g)" style={styles.input} required />
                    <input name="diameter" type="number" value={form.diameter} onChange={handleInputChange} placeholder="Diameter (cm)" style={styles.input} />
                    <input name="thickness" type="number" value={form.thickness} onChange={handleInputChange} placeholder="Thickness (cm)" style={styles.input} />
                    <input name="expectedDensity" type="number" step="0.01" value={form.expectedDensity} onChange={handleInputChange} placeholder="Expected Density" style={styles.input} required />

                    <div style={{ marginTop: 20 }}>
                        <button type="submit" style={styles.saveButton}>
                            {editingItem ? "Update" : "Create"} Item
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); resetForm(); }} style={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            <h2>{activeTab === "coins" ? "Coins" : "Bars"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
                {(activeTab === "coins" ? coins : bars).map(item => (
                    <div key={item.id} style={styles.card}>
                        <h4>{item.name}</h4>
                        <p><strong>Freq:</strong> {item.idealFreq} Hz ±{item.tolerance}</p>
                        <p><strong>Weight:</strong> {item.weight}g</p>
                        <p><strong>Density:</strong> {item.expectedDensity}</p>

                        <div style={{ marginTop: 12 }}>
                            <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                            <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: "1px solid #ddd",
        padding: 15,
        borderRadius: 10,
        background: "#fafafa"
    },
    input: {
        width: "100%",
        padding: 10,
        margin: "8px 0",
        borderRadius: 6,
        border: "1px solid #ccc"
    },
    saveButton: {
        padding: "12px 24px",
        background: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: 8,
        marginRight: 10
    },
    cancelButton: {
        padding: "12px 24px",
        background: "#666",
        color: "white",
        border: "none",
        borderRadius: 8
    },
    editBtn: {
        padding: "6px 12px",
        background: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: 6,
        marginRight: 8
    },
    deleteBtn: {
        padding: "6px 12px",
        background: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: 6
    }
};