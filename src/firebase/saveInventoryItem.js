import {
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig";

export async function saveInventoryItem(data) {
    try {

        const docRef = await addDoc(
            collection(db, "inventory"),
            {
                ...data.item,

                userId: data.userId,

                createdAt: serverTimestamp()
            }
        );

        console.log(
            "Inventory item saved:",
            docRef.id
        );

        return docRef.id;

    } catch (error) {

        console.error(
            "Error saving inventory item:",
            error
        );

        throw error;
    }
}