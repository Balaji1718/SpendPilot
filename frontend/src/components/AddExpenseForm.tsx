import { useMemo, useState } from "react";
import { CalendarDays, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES, addExpense } from "@/services/expenses";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onSaved: () => Promise<void> | void;
}

export default function AddExpenseForm({ onSaved }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && Number(amount) > 0 && Boolean(category) && Boolean(date);
  }, [title, amount, category, date]);

  const handleSave = async () => {
    if (!canSubmit || !user) {
      return;
    }
    setSubmitting(true);
    try {
      await addExpense(user.uid, {
        title: title.trim(),
        description: title.trim(),
        amount: Number(amount),
        category,
        date,
        note: note.trim(),
      });

      toast({ title: "Expense saved" });
      setTitle("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setNote("");
      await onSaved();
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-primary" />
        <h2 className="font-display font-semibold text-lg">Add Expense</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Log your spending details for this month.</p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="expense-title">Title</Label>
          <Input
            id="expense-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery run"
            disabled={submitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="expense-amount">Amount</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={submitting}>
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expense-date" className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            Date
          </Label>
          <Input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expense-note">Note</Label>
          <Textarea
            id="expense-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional details"
            rows={3}
            disabled={submitting}
          />
        </div>

        <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSave} disabled={!canSubmit || submitting}>
          Save Expense
        </Button>
      </div>
    </div>
  );
}
