import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { COIN_PROFILES } from "../features/ping/coinProfiles.js";

export const uploadCoinProfiles = async () => {
  try {
    console.log("Uploading coin profiles...");

    for (const key in COIN_PROFILES) {
      await setDoc(
        doc(db, "coinProfiles", key),
        {
          ...COIN_PROFILES[key]
        },
        { merge: true }
      );

      console.log(`✅ Uploaded: ${key}`);
    }

    console.log("🎉 All coin profiles uploaded!");
  } catch (error) {
    console.error("❌ Error uploading coin profiles:", error);
  }
};