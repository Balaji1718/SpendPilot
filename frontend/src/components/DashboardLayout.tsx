import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  List,
  Wallet,
  FileDown,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Tab =
  | "dashboard"
  | "add-expense"
  | "all-expenses"
  | "budget"
  | "export-csv"
  | "ai-tips"
  | "chat";

interface Props {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "add-expense", label: "Add Expense", icon: PlusCircle },
  { id: "all-expenses", label: "All Expenses", icon: List },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "export-csv", label: "Export CSV", icon: FileDown },
  { id: "ai-tips", label: "AI Tips", icon: Sparkles },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
];

export default function DashboardLayout({ activeTab, onTabChange, children }: Props) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compactSidebar, setCompactSidebar] = useState(false);
  const userName = user?.displayName || user?.email || "Member";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff_0%,#f8fafc_45%,#f1f5f9_100%)] flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl p-3 transition-all duration-200 ${
          compactSidebar ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center gap-2 mb-5 px-1">
          <div className="w-9 h-9 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-700" />
          </div>
          {!compactSidebar && <span className="font-display font-bold text-base text-slate-800">Spend Atlas</span>}
          <button
            onClick={() => setCompactSidebar((prev) => !prev)}
            className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Toggle sidebar width"
          >
            {compactSidebar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${compactSidebar ? "justify-center" : "justify-start"} gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === item.id
                  ? "bg-teal-600 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
              {!compactSidebar && item.label}
            </button>
          ))}
        </nav>

        <div className="pt-3 border-t border-white/15 space-y-2">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center">
              {initials}
            </div>
            {!compactSidebar && (
              <div className="min-w-0">
                <p className="text-xs text-slate-800 font-medium truncate">{userName}</p>
                <p className="text-[11px] text-slate-500">Member</p>
              </div>
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all">
                <LogOut className="w-4 h-4" />
                {!compactSidebar && "Logout"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out of SpendPilot?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Sign Out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-700" />
          </div>
          <span className="font-display font-bold text-slate-800">Spend Atlas</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-700">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-sm pt-16 flex flex-col"
        >
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-teal-600 text-white"
                    : "text-slate-700 bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="rounded-xl bg-white border border-slate-200/80 p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-sm font-semibold flex items-center justify-center">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800 font-semibold truncate">{userName}</p>
                <p className="text-xs text-slate-500">Member</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[92%] max-w-sm rounded-2xl p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-bold text-slate-900">Sign out?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-slate-600">
                    Are you sure you want to sign out of SpendPilot?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-3 mt-6">
                  <AlertDialogCancel className="flex-1 mt-0 rounded-xl border-slate-200 text-slate-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout} className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white">Sign Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 md:p-5 p-4 pt-20 md:pt-5 overflow-auto">{children}</main>
    </div>
  );
}
