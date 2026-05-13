// src/firebase/saveInventoryItem.js
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveInventoryItem = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "inventory"), {
            userId: data.userId,
            ...data.item,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving inventory item:", error);
        throw error;
    }
};