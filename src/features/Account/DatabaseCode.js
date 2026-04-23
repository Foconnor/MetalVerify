import { doc, setDoc, getDoc, serverTimestamp, addDoc, collection, deleteDoc } from "firebase/firestore";
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

export const savePingTest = async (testData) => {
  const user = getAuth().currentUser;

  if (!user) return;

  const testsRef = collection(db, "users", user.uid, "tests");

  await addDoc(testsRef, {
    type: "ping",
    ...testData,

    // NEW FIELDS
    threeTestId: testData.threeTestId || null,
    label: testData.label || null,

    createdAt: serverTimestamp(),
  });
};

export const saveDensityTest = async (testData) => {
  const user = getAuth().currentUser;

  if (!user) return;

  const testsRef = collection(db, "users", user.uid, "tests");

  await addDoc(testsRef, {
    type: "density",
    ...testData,

    // NEW FIELDS
    threeTestId: testData.threeTestId || null,
    label: testData.label || null,

    createdAt: serverTimestamp(),
  });
};

export const deleteTest = async (testId) => {
  const user = getAuth().currentUser;

  if (!user) throw new Error("User not logged in");

  const testRef = doc(db, "users", user.uid, "tests", testId);

  await deleteDoc(testRef);
};