import { useEffect, useState } from "react";
import {
    collection,
    getDocs, query, where
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
    const { user } = useAuth();

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;

        async function fetchInventory() {

            const q = query(
                collection(db, "inventory"),
                where("userId", "==", user.uid)
            );

            const snapshot = await getDocs(q);

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