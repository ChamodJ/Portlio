import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveSnapshot(snapshot) {
  return addDoc(collection(db, "snapshots"), {
    ...snapshot,
    createdAt: serverTimestamp(),
  });
}

export async function getSnapshots() {
  const q = query(collection(db, "snapshots"), orderBy("date", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}