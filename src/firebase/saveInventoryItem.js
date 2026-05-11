import { db } from "./firebaseConfig";
import {
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

export async function saveInventoryItem({
                                            userId,
                                            item
                                        }) {
    try {
        const docRef = await addDoc(
            collection(db, "users", userId, "inventory"),
            {
                ...item,
                createdAt: serverTimestamp()
            }
        );

        return docRef.id;
    } catch (error) {
        console.error("Error saving inventory item:", error);
        throw error;
    }
}