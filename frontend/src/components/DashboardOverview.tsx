import { Expense } from "@/services/expenses";
import { Budget } from "@/services/budgets";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { buildAiTips, getExceededBudgetMessages } from "@/lib/finance";

interface Props {
  monthName: string;
  monthExpenses: Expense[];
  categoryTotals: Record<string, number>;
  dailyTrend: { date: string; amount: number }[];
  monthBudgets: Budget[];
  onOpenAddExpense: () => void;
  onOpenAllExpenses: () => void;
}

const PIE_COLORS = ["#0f766e", "#0284c7", "#f59e0b", "#7c3aed", "#14b8a6", "#ef4444", "#0891b2", "#334155"];

export default function DashboardOverview({
  monthName,
  monthExpenses,
  categoryTotals,
  dailyTrend,
  monthBudgets,
  onOpenAddExpense,
  onOpenAllExpenses,
}: Props) {
  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const activeBudgets = monthBudgets.length;
  const warnings = getExceededBudgetMessages(monthBudgets, categoryTotals);
  const tips = buildAiTips(monthExpenses, monthBudgets, categoryTotals);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">Financial Workspace</h1>
          <p className="text-sm text-muted-foreground">Month: {monthName}</p>
        </div>
        <button
          onClick={onOpenAddExpense}
          className="rounded-lg px-4 py-2 text-sm font-medium bg-teal-700 hover:bg-teal-800 text-white shadow-soft"
        >
          + New Expense
        </button>
      </motion.div>

      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <div className="font-medium inline-flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Budget exceeded in {warnings.length} categor{warnings.length > 1 ? "ies" : "y"}
          </div>
          <p className="mt-1">{warnings[0]}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.2 }}
        className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-4"
      >
        <h3 className="font-display font-semibold text-sm mb-2 text-teal-800">Weekly Guidance</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          {tips.slice(0, 2).map((tip) => (
            <li key={tip}>- {tip}</li>
          ))}
        </ul>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <StatCard
          title="Total This Month"
          value={`Rs.${Math.round(totalSpent).toLocaleString()}`}
          className="bg-white border border-slate-200 text-slate-900"
          delay={0.12}
        />
        <StatCard
          title="Expenses Logged"
          value={monthExpenses.length.toString()}
          className="bg-white border border-slate-200 text-slate-900"
          delay={0.16}
        />
        <StatCard
          title="Active Budgets"
          value={activeBudgets.toString()}
          className="bg-white border border-slate-200 text-slate-900"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <h3 className="font-display font-semibold mb-3">Spending by Category</h3>
          {pieData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add expenses to view category insights.</p>
          ) : (
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rs.${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <h3 className="font-display font-semibold mb-3">Daily Spending Trend</h3>
          {dailyTrend.length === 0 ? (
            <p className="text-sm text-muted-foreground">No spend data for selected month.</p>
          ) : (
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend} margin={{ left: 6, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tickFormatter={(value: string) => value.slice(8)} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rs.${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.2 }}
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold">Recent Expenses</h3>
          <button
            onClick={onOpenAllExpenses}
            className="text-xs text-teal-700 hover:text-teal-800 underline underline-offset-2"
          >
            View All
          </button>
        </div>
        {monthExpenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses found for {monthName}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Category</th>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthExpenses.slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="border-b border-border/60">
                    <td className="py-2 pr-2">{expense.title || expense.description}</td>
                    <td className="py-2 pr-2">{expense.category}</td>
                    <td className="py-2 pr-2">{expense.date}</td>
                    <td className="py-2 text-right font-medium text-teal-700">Rs.{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  title,
  value,
  className,
  delay,
}: {
  title: string;
  value: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={`rounded-xl p-4 shadow-soft ${className}`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-3xl font-display font-bold mt-2">{value}</p>
    </motion.div>
  );
}
