import { doc, setDoc, getDoc, getDocs, serverTimestamp, addDoc, collection, deleteDoc } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { getAuth } from "firebase/auth";

export const createUserIfNotExists = async (user) => {
  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName || "Unnamed User",
      createdAt: serverTimestamp(),
      plan: "free",
    });
  }
};

export const saveDensityTest = async (testData) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.error("No user logged in");
    return;
  }

  const testsRef = collection(db, "users", user.uid, "tests");

  await addDoc(testsRef, {
    type: "density",
    ...testData,
    createdAt: serverTimestamp(),
  });
};

export const deleteTest = async (testId) => {
  const user = getAuth().currentUser;

  if (!user) throw new Error("User not logged in");

  const testRef = doc(db, "users", user.uid, "tests", testId);

  await deleteDoc(testRef);
};

export const fetchCoinProfiles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "coinProfiles"));

    const coinData = {};

    querySnapshot.forEach((doc) => {
      coinData[doc.id] = doc.data();
    });

    return coinData;
  } catch (error) {
    console.error("Error fetching coin profiles:", error);
    throw error;
  }
};

export const getRecentDensityTests = async () => {
  const user = getAuth().currentUser;

  if (!user) throw new Error("User not logged in");

  // console.log("Fetching recent tests for user:", user.uid);
  

  const testsRef = collection(db, "users", user.uid, "tests");

  const snapshot = await getDocs(testsRef);

  // console.log("Fetched test documents:", snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};