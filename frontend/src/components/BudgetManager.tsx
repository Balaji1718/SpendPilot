import { useMemo, useState } from "react";
import { CircleCheck, PiggyBank } from "lucide-react";
import { CATEGORIES } from "@/services/expenses";
import { Budget, addBudget } from "@/services/budgets";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { buildAiTips, getCategoryTotals, getMonthBudgets, MONTHS } from "@/lib/finance";
import { Expense } from "@/services/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  budgets: Budget[];
  expenses: Expense[];
  month: number;
  year: number;
  onSaved: () => Promise<void> | void;
}

export default function BudgetManager({ budgets, expenses, month, year, onSaved }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const monthBudgets = useMemo(() => getMonthBudgets(budgets, month, year), [budgets, month, year]);
  const monthExpenses = useMemo(
    () => expenses.filter((exp) => {
      const d = new Date(exp.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }),
    [expenses, month, year]
  );

  const tips = useMemo(() => {
    const totals = getCategoryTotals(monthExpenses);
    return buildAiTips(monthExpenses, monthBudgets, totals);
  }, [monthExpenses, monthBudgets]);

  const handleSave = async () => {
    if (!user || !category || Number(limit) <= 0) {
      return;
    }
    try {
      await addBudget(user.uid, {
        category,
        limit: Number(limit),
        month,
        year,
      });
      setCategory("");
      setLimit("");
      setSaveSuccess(true);
      toast({ title: "Budget saved" });
      await onSaved();
    } catch (err: any) {
      toast({ title: "Failed to save budget", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {saveSuccess && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm inline-flex items-center gap-2">
          <CircleCheck className="w-4 h-4" />
          Budget saved
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-display font-semibold mb-3 inline-flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-primary" />
            Set Budget
          </h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Monthly limit</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="3000"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>Month: {MONTHS[month - 1]}</div>
              <div>Year: {year}</div>
            </div>
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSave} disabled={!category || Number(limit) <= 0}>
              Save Budget
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-display font-semibold mb-3">This Month's Budgets</h3>
          {monthBudgets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No budgets set for this month.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-2">Category</th>
                    <th className="py-2 text-right">Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {monthBudgets.map((item) => (
                    <tr key={item.id} className="border-b border-border/60">
                      <td className="py-2 pr-2">{item.category}</td>
                      <td className="py-2 text-right text-pink-600 font-medium">Rs.{item.limit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-display font-semibold mb-1">Budget Assistant</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Suggestions based on your current spending and budgets.
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {tips.slice(0, 3).map((tip) => (
            <li key={tip}>- {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
