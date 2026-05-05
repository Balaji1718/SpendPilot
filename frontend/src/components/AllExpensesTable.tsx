import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Expense, deleteExpense } from "@/services/expenses";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  expenses: Expense[];
  onDeleted: () => Promise<void> | void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "bg-pink-100 text-pink-700",
  Transport: "bg-blue-100 text-blue-700",
  Shopping: "bg-indigo-100 text-indigo-700",
  "Bills & Utilities": "bg-teal-100 text-teal-700",
  Entertainment: "bg-amber-100 text-amber-700",
  Health: "bg-rose-100 text-rose-700",
  Education: "bg-violet-100 text-violet-700",
  Other: "bg-slate-100 text-slate-700",
};

export default function AllExpensesTable({ expenses, onDeleted }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return expenses;
    }
    return expenses.filter((expense) => {
      const title = (expense.title || expense.description || "").toLowerCase();
      return (
        title.includes(value) ||
        expense.category.toLowerCase().includes(value) ||
        expense.date.toLowerCase().includes(value)
      );
    });
  }, [expenses, query]);

  const handleDelete = async (id: string) => {
    if (!user) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteExpense(user.uid, id);
      toast({ title: "Expense deleted" });
      await onDeleted();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-display font-semibold text-lg">All Expenses</h3>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, category, date"
            className="pl-9"
          />
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No expenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-muted-foreground">
                <th className="py-2 pr-2">Title</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Date</th>
                <th className="py-2 pr-2 text-right">Amount</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-100">
                  <td className="py-2.5 pr-2">{expense.title || expense.description}</td>
                  <td className="py-2.5 pr-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-muted-foreground">{expense.date}</td>
                  <td className="py-2.5 pr-2 text-right font-medium text-fuchsia-700">Rs.{expense.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
