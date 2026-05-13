// src/pages/InventoryPage.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchInventory = async () => {
            const q = query(
                collection(db, "inventory"),
                where("userId", "==", user.uid)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(data);
        };

        fetchInventory();
    }, [user]);

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
            <h1>My Inventory</h1>

            {items.length === 0 ? (
                <p>No items in inventory yet.</p>
            ) : (
                items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: 15,
                            marginBottom: 15,
                            borderRadius: 8,
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(`/inventory/${item.id}`)}
                    >
                        <h3>{item.name}</h3>
                        <p><strong>Type:</strong> {item.type}</p>
                        <p><strong>Year:</strong> {item.year || "—"}</p>
                    </div>
                ))
            )}
        </div>
    );
}