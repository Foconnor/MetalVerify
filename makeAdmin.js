import admin from "firebase-admin";
import fs from "fs";

// Load service account key
const serviceAccount = JSON.parse(
  fs.readFileSync(
    "metal-verify-firebase-adminsdk-fbsvc-9aa4ba6933.json",
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// UID of the user you want to make admin
const uid = "DvmnqLde6agoYxfzTAZgKWj4TM52";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("✅ User is now admin");
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });