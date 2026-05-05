import { Expense } from "@/services/expenses";
import { Budget } from "@/services/budgets";
import { buildAiTips, getCategoryTotals, getMonthBudgets } from "@/lib/finance";
import { Lightbulb } from "lucide-react";

interface Props {
  expenses: Expense[];
  budgets: Budget[];
  month: number;
  year: number;
}

export default function AITipsPanel({ expenses, budgets, month, year }: Props) {
  const monthExpenses = expenses.filter((exp) => {
    const d = new Date(exp.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const monthBudgets = getMonthBudgets(budgets, month, year);
  const totals = getCategoryTotals(monthExpenses);
  const tips = buildAiTips(monthExpenses, monthBudgets, totals);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-3xl mx-auto shadow-soft">
      <h2 className="font-display font-semibold text-lg inline-flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        AI Tips
      </h2>
      <p className="text-xs text-muted-foreground mb-3">Contextual suggestions generated from your selected month spending.</p>
      <div className="space-y-2">
        {tips.map((tip) => (
          <div key={tip} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-sm text-foreground">
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
