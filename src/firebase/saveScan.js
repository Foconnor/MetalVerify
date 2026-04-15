import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveScan = async (scanData) => {
    try {
        await addDoc(collection(db, "userScans"), {
            ...scanData,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving scan:", error);
    }
};