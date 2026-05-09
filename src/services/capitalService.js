import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COL = "capital";

export async function getCapitalEntries() {
  const q = query(collection(db, COL), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCapitalEntry(entry) {
  return addDoc(collection(db, COL), { ...entry, createdAt: serverTimestamp() });
}

export async function deleteCapitalEntry(id) {
  return deleteDoc(doc(db, COL, id));
}