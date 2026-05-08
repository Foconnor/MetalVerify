import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig.js";

// GET ARTICLES
export const getArticles = async () => {
  const q = query(
    collection(db, "articles"),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ADD ARTICLE
export const addArticle = async (articleData) => {
  await addDoc(collection(db, "articles"), {
    ...articleData,
    createdAt: new Date(),
  });
};

// DELETE ARTICLE
export const deleteArticle = async (id) => {
  await deleteDoc(doc(db, "articles", id));
};

// UPDATE ARTICLE
export const updateArticle = async (id, updatedData) => {
  await updateDoc(doc(db, "articles", id), updatedData);
};