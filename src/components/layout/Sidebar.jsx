import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  X,
} from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/capital", icon: Wallet, label: "Capital" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full w-64 bg-surface-900 border-r border-surface-800 flex flex-col z-40 transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-surface-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <TrendingUp size={16} className="text-surface-950" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-700 text-sm text-surface-50 leading-tight">
              Portlio
            </p>
            <p className="text-xs text-surface-500 leading-tight">Personal Portfolio Tracker</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                isActive
                  ? "bg-accent text-surface-950 font-display font-600"
                  : "text-surface-400 hover:text-surface-50 hover:bg-surface-800"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-surface-800">
        <p className="text-xs text-surface-600">Portlio</p>
        <p className="text-xs text-taupe-400 mt-0.5">v1.0</p>
      </div>
    </aside>
  );
}
