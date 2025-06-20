import { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../Firebase/firebase_config";

export const useUpdate = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (docId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const db = getFirestore(app);
      const docRef = doc(db, collectionName, String(docId));
      await updateDoc(docRef, updatedData);
      return { id: String(docId), ...updatedData };
    } catch (err) {
      console.error("Error updating document:", err);
      setError(err.message || "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading, error };
};
