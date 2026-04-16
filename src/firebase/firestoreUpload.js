import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { COIN_PROFILES } from "../features/ping/coinProfiles.js";
import { SILVER_BAR_PROFILES } from "../features/ping/barProfiles.js";

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

export const uploadBarProfiles = async () => {
  try {
    console.log("Uploading bar profiles...");

    for (const key in SILVER_BAR_PROFILES) {
      await setDoc(
          doc(db, "barProfiles", key),
          {
            ...SILVER_BAR_PROFILES[key]
          },
          { merge: true }
      );

      console.log(`✅ Uploaded: ${key}`);
    }

    console.log("🎉 All bar profiles uploaded!");
  } catch (error) {
    console.error("❌ Error uploading bar profiles:", error);
  }
};