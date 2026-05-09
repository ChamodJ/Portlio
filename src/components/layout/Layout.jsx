import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, TrendingUp } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b border-surface-800 bg-surface-950 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-50 hover:bg-surface-800 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <TrendingUp size={12} className="text-surface-950" strokeWidth={2.5} />
            </div>
            <p className="font-display font-700 text-sm text-surface-50 leading-tight">
              CSE Portfolio
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
