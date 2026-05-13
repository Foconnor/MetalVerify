import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (!user) return;

        const fetchInventory = async () => {
            try {
                const q = query(
                    collection(db, "inventory"),
                    where("userId", "==", user.uid)
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setItems(data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [user]);

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <h1>My Inventory</h1>

                {/* Add New Item Button - Top Right Corner */}
                <button
                    onClick={() => navigate("/inventory/add")}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    + Add New Item
                </button>
            </div>

            {loading ? (
                <p>Loading inventory...</p>
            ) : items.length === 0 ? (
                <p>You don't have any items in your inventory yet.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/inventory/${item.id}`)}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                padding: "20px",
                                cursor: "pointer",
                                backgroundColor: "#f9f9f9"
                            }}
                        >
                            <h3>{item.name}</h3>
                            <p><strong>Type:</strong> {item.type}</p>
                            <p><strong>Year:</strong> {item.year || "—"}</p>
                            <p><strong>Mint/Refiner:</strong> {item.mintRefiner || "—"}</p>
                            <p><strong>Weight:</strong> {item.weight}</p>
                            {item.description1 && <p>{item.description1}</p>}
                        </div>
                    ))}
                </div>
            )}
            <button style={styles.button} onClick={() => navigate("/")}>
                Back to home
            </button>
        </div>
    );
}