import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: number;
  year: number;
  createdAt: Date;
}

export async function addBudget(
  userId: string,
  data: { category: string; limit: number; month: number; year: number }
) {
  const ref = collection(db, "users", userId, "budgets");
  return addDoc(ref, {
    category: data.category,
    limit: data.limit,
    month: data.month,
    year: data.year,
    createdAt: Timestamp.now(),
  });
}

export async function getBudgets(userId: string): Promise<Budget[]> {
  const ref = collection(db, "users", userId, "budgets");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    category: d.data().category,
    limit: Number(d.data().limit || 0),
    month: Number(d.data().month || 1),
    year: Number(d.data().year || new Date().getFullYear()),
    createdAt: d.data().createdAt?.toDate?.() || new Date(),
  }));
}
