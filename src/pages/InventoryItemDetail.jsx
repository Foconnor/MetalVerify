import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/layout/PageLayout";
import AppHeader from "../components/layout/AppHeader";

export default function InventoryItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !id) return;

        const fetchItem = async () => {
            try {
                const itemRef = doc(db, "inventory", id);
                const snapshot = await getDoc(itemRef);

                if (snapshot.exists()) {
                    setItem({ id: snapshot.id, ...snapshot.data() });
                } else {
                    alert("Inventory item not found");
                    navigate("/inventory");
                }
            } catch (error) {
                console.error("Error fetching inventory item:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, user, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!item) return <p>Item not found.</p>;

    return (
        <PageLayout>
            <AppHeader />
            
            <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
                <button onClick={() => navigate("/inventory")} style={{ marginBottom: 20 }}>
                    ← Back to Inventory
                </button>

                <h1>{item.name}</h1>

                <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8 }}>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Year:</strong> {item.year || "—"}</p>
                    <p><strong>Mint:</strong> {item.mint || "—"}</p>
                    <p><strong>Metal:</strong> {item.metal}</p>
                    <p><strong>Weight:</strong> {item.weight}</p>
                    <p><strong>Diameter:</strong> {item.diameter}</p>

                    {item.description1 && (
                        <p><strong>Description:</strong> {item.description1}</p>
                    )}

                    {item.description2 && (
                        <p><strong>Notes:</strong> {item.description2}</p>
                    )}

                    {item.serialNumber && (
                        <p><strong>Serial Number:</strong> {item.serialNumber}</p>
                    )}
                </div>

                {item.linkedThreeTestId && (
                    <p style={{ marginTop: 20 }}>
                        <strong>Linked 3-Test ID:</strong> {item.linkedThreeTestId}
                    </p>
                )}
            </div>
        </PageLayout>
    );
}