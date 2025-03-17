import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../Firebase/firebase_config";

export const usePost = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (newData) => {
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore(app);
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, newData);
      return { id: docRef.id, ...newData };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};
