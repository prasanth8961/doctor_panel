import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "../Firebase/firebase_config";

export const useDelete = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore(app);
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
};
