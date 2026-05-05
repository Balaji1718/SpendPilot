import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Expense {
  id: string;
  title?: string;
  amount: number;
  category: string;
  description: string;
  note?: string;
  date: string;
  createdAt: Date;
}

export async function addExpense(
  userId: string,
  data: {
    amount: number;
    category: string;
    description?: string;
    title?: string;
    note?: string;
    date?: string;
  }
) {
  const ref = collection(db, "users", userId, "expenses");
  const now = new Date();
  const title = data.title || data.description || data.category;
  const description = data.description || title;
  return addDoc(ref, {
    amount: data.amount,
    category: data.category,
    title,
    description,
    note: data.note || "",
    date: data.date || now.toISOString().split("T")[0],
    createdAt: Timestamp.now(),
  });
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  const ref = collection(db, "users", userId, "expenses");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() || new Date(),
  })) as Expense[];
}

export async function deleteExpense(userId: string, expenseId: string) {
  const ref = doc(db, "users", userId, "expenses", expenseId);
  return deleteDoc(ref);
}

export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;
