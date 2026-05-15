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
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <h1>My Inventory</h1>

                <div style={{ display: "flex", gap: "12px" }}>
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

                    <button
                        onClick={() => navigate("/")}
                        style={{
                            padding: "12px 20px",
                            backgroundColor: "#666",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        ← Return to Home
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading your inventory...</p>
            ) : items.length === 0 ? (
                <p>You don't have any items in your inventory yet.</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "20px"
                }}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/inventory/${item.id}`)}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                padding: "20px",
                                backgroundColor: "#fafafa",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                            }}
                        >
                            {/* Inventory ID + Name - Prominent */}
                            <div style={{ marginBottom: 12 }}>
                                {item.inventoryId && (
                                    <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 4px 0" }}>
                                        <strong>ID:</strong> {item.inventoryId}
                                    </p>
                                )}
                                <h4 style={{ margin: "0 0 8px 0" }}>
                                    {item.description || item.name || "Unnamed Item"}
                                </h4>
                            </div>

                            <p><strong>Type:</strong> {item.type?.toUpperCase() || "—"}</p>
                            <p><strong>Year:</strong> {item.yearDate || "—"}</p>
                            <p><strong>Weight:</strong> {item.weight || "—"}</p>
                            <p><strong>Mint / Refiner:</strong> {item.mintRefiner || "—"}</p>

                            {item.serialLot && (
                                <p><strong>Serial:</strong> {item.serialLot}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}