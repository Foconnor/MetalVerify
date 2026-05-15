import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function InventoryItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [item, setItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (!user || !id) return;

        const fetchItem = async () => {
            try {
                const itemRef = doc(db, "inventory", id);
                const snapshot = await getDoc(itemRef);

                if (snapshot.exists()) {
                    const data = { id: snapshot.id, ...snapshot.data() };
                    setItem(data);
                    setForm(data);
                } else {
                    alert("Item not found");
                    navigate("/inventory");
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const itemRef = doc(db, "inventory", id);
            await updateDoc(itemRef, form);

            setItem(form);
            setIsEditing(false);
            alert("Item updated successfully!");
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item.");
        }
    };

    if (loading) return <p>Loading item details...</p>;
    if (!item) return <p>Item not found.</p>;

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
            <button onClick={() => navigate("/inventory")} style={{ marginBottom: 20 }}>
                ← Back to Inventory
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1>{item.inventoryId}</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                        padding: "10px 20px",
                        background: isEditing ? "#d32f2f" : "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer"
                    }}
                >
                    {isEditing ? "Cancel Editing" : "Edit Item"}
                </button>
            </div>

            {isEditing ? (
                // ==================== EDIT MODE ====================
                <div style={{ background: "#f9f9f9", padding: 25, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <label>Inventory ID</label>
                        <input name="inventoryId" value={form.inventoryId || ""} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Description</label>
                        <input name="description" value={form.description || ""} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                        <div>
                            <label>Type</label>
                            <select name="type" value={form.type || ""} onChange={handleChange} style={styles.input}>
                                <option value="coin">Coin</option>
                                <option value="round">Round</option>
                                <option value="bar">Bar</option>
                            </select>
                        </div>
                        <div>
                            <label>Year / Date</label>
                            <input name="yearDate" value={form.yearDate || ""} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Mint / Refiner</label>
                        <input name="mintRefiner" value={form.mintRefiner || ""} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                        <div>
                            <label>Weight</label>
                            <input name="weight" value={form.weight || ""} onChange={handleChange} style={styles.input} />
                        </div>
                        <div>
                            <label>Purity</label>
                            <input name="purity" value={form.purity || ""} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label>Quantity</label>
                        <input type="number" name="quantity" value={form.quantity || ""} onChange={handleChange} style={styles.input} />
                    </div>

                    <button onClick={handleSave} style={styles.saveButton}>Save Changes</button>
                </div>
            ) : (
                // ==================== VIEW MODE ====================
                <div style={{ background: "#f9f9f9", padding: 25, borderRadius: 12, lineHeight: 1.8 }}>
                    <p><strong>Inventory ID:</strong> {item.inventoryId || "—"}</p>
                    <p><strong>Type:</strong> {item.type?.toUpperCase() || "—"}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Year / Date:</strong> {item.yearDate || "—"}</p>
                    <p><strong>Mint / Refiner:</strong> {item.mintRefiner || "—"}</p>
                    <p><strong>Weight:</strong> {item.weight || "—"}</p>
                    <p><strong>Purity:</strong> {item.purity || "—"}</p>
                    <p><strong>Quantity:</strong> {item.quantity || "—"}</p>
                    <p><strong>Serial / Lot #:</strong> {item.serialLot || "—"}</p>
                    <p><strong>Purchase Date:</strong> {item.purchaseDate || "—"}</p>
                    <p><strong>Cost per oz:</strong> {item.currency || "$"}{item.costPerOz || "—"}</p>
                    <p><strong>Total Cost:</strong> {item.currency || "$"}{item.totalCost || "—"}</p>
                    <p><strong>Location:</strong> {item.location || "—"}</p>
                    {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                </div>
            )}
        </div>
    );
}

const styles = {
    input: {
        width: "100%",
        padding: 12,
        margin: "8px 0",
        borderRadius: 6,
        border: "1px solid #ccc"
    },
    saveButton: {
        marginTop: 20,
        padding: "12px 24px",
        backgroundColor: "#1e1e1e",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 16,
        width: "100%"
    }
};