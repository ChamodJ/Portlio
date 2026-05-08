import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COL = "transactions";

export async function getTransactions() {
  const q = query(collection(db, COL), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addTransaction(tx) {
  return addDoc(collection(db, COL), { ...tx, createdAt: serverTimestamp() });
}

export async function deleteTransaction(id) {
  return deleteDoc(doc(db, COL, id));
}