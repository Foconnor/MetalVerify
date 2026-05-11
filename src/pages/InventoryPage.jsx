import { useEffect, useState } from "react";
import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
    const { user } = useAuth();

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;

        async function fetchInventory() {
            const snapshot = await getDocs(
                collection(db, "users", user.uid, "inventory")
            );

            const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setItems(results);
        }

        fetchInventory();
    }, [user]);

    return (
        <div>
            <h1>Inventory</h1>

            {items.map(item => (
                <div key={item.id}>
                    <h3>{item.name}</h3>

                    <p>{item.type}</p>

                    <p>{item.description1}</p>
                </div>
            ))}
        </div>
    );
}