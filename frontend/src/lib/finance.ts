import { Budget } from "@/services/budgets";
import { Expense } from "@/services/expenses";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseExpenseDate(dateValue: string): Date {
  const parsed = new Date(dateValue);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
}

export function filterExpensesByMonth(expenses: Expense[], month: number, year: number): Expense[] {
  return expenses.filter((exp) => {
    const d = parseExpenseDate(exp.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
}

export function getCategoryTotals(expenses: Expense[]): Record<string, number> {
  return expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
}

export function getDailyTrend(expenses: Expense[]) {
  const byDate = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
    return acc;
  }, {});

  return Object.entries(byDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMonthBudgets(budgets: Budget[], month: number, year: number): Budget[] {
  return budgets.filter((b) => b.month === month && b.year === year);
}

export function getExceededBudgetMessages(
  monthBudgets: Budget[],
  categoryTotals: Record<string, number>
): string[] {
  return monthBudgets
    .map((budget) => {
      const spent = categoryTotals[budget.category] || 0;
      if (spent <= budget.limit) {
        return null;
      }
      const overBy = Math.round((spent - budget.limit) * 100) / 100;
      return `${budget.category}: Rs.${spent.toLocaleString()} / Rs.${budget.limit.toLocaleString()} (Rs.${overBy.toLocaleString()} over)`;
    })
    .filter((value): value is string => Boolean(value));
}

export function buildAiTips(
  expenses: Expense[],
  monthBudgets: Budget[],
  categoryTotals: Record<string, number>
): string[] {
  if (expenses.length === 0) {
    return ["Add your first expense to unlock personalized tips."];
  }

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const tips: string[] = [];

  if (topCategories.length > 0) {
    tips.push(`Your largest spend is ${topCategories[0][0]} (Rs.${topCategories[0][1].toLocaleString()}). Set a weekly cap for this category.`);
  }

  if (topCategories.length > 1) {
    tips.push(`Second highest category is ${topCategories[1][0]}. Small reductions there can improve monthly savings quickly.`);
  }

  const exceeded = getExceededBudgetMessages(monthBudgets, categoryTotals);
  if (exceeded.length > 0) {
    tips.push(`You exceeded ${exceeded.length} budget category${exceeded.length > 1 ? "ies" : ""}. Rebalance budgets for next month.`);
  } else if (monthBudgets.length > 0) {
    tips.push("Great progress. You are currently within the set category budgets.");
  } else {
    tips.push("Set category budgets to get over-spend alerts and safer daily limits.");
  }

  return tips;
}

export function buildCsv(expenses: Expense[]): string {
  const headers = ["Title", "Category", "Amount", "Date", "Note"];
  const rows = expenses.map((exp) => [
    sanitizeCsvValue(exp.title || exp.description),
    sanitizeCsvValue(exp.category),
    exp.amount.toString(),
    sanitizeCsvValue(exp.date),
    sanitizeCsvValue(exp.note || ""),
  ]);
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

function sanitizeCsvValue(value: string): string {
  if (!value.includes(",") && !value.includes("\"") && !value.includes("\n")) {
    return value;
  }
  return `"${value.replace(/\"/g, "\"\"")}"`;
}
