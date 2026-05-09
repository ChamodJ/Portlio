import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatLKR, formatPercent } from "../../calculations/portfolio";
import { Skeleton, EmptyState } from "../ui";
import clsx from "clsx";

const PAGE_SIZE = 5;

function PLCell({ value, percent }) {
  if (value === null) return <span className="neutral-text text-xs">—</span>;
  const isPositive = value >= 0;
  const Icon = value === 0 ? Minus : isPositive ? TrendingUp : TrendingDown;
  return (
    <div className={clsx("flex items-center justify-end gap-1.5", isPositive ? "text-profit" : "text-loss")}>
      <Icon size={12} strokeWidth={2.5} />
      <span className="font-mono text-sm">{formatLKR(value)}</span>
      {percent !== null && <span className="text-xs opacity-70">{formatPercent(percent)}</span>}
    </div>
  );
}

function HoldingCard({ h }) {
  return (
    <div className="px-4 py-4 border-t border-surface-800/60 first:border-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-mono font-600 text-sm" style={{ color: "var(--color-accent)" }}>{h.ticker}</span>
          <p className="text-xs text-surface-400 mt-0.5 leading-tight">{h.companyName}</p>
        </div>
        <PLCell value={h.unrealizedPL} percent={h.plPercent} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
        {[
          { label: "Shares", val: h.totalShares.toLocaleString() },
          { label: "Avg Buy", val: formatLKR(h.weightedAvgBuyPrice) },
          { label: "Current", val: h.currentPrice !== null ? formatLKR(h.currentPrice) : "—" },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>{label}</p>
            <p className="font-mono text-surface-300">{val}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-surface-800/40 flex justify-between items-center">
        <p className="text-surface-600 text-xs uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Value</p>
        <p className="font-mono text-sm text-surface-200">
          {h.currentValue !== null ? formatLKR(h.currentValue) : formatLKR(h.totalCost)}
        </p>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-surface-800">
      <p className="text-xs text-surface-600 font-mono">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              "w-7 h-7 rounded-lg text-xs font-mono transition-colors",
              p === page
                ? "text-white font-600"
                : "text-surface-500 hover:text-surface-200 hover:bg-surface-800"
            )}
            style={p === page ? { backgroundColor: "var(--color-accent)", color: "#fff" } : {}}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function HoldingsTable({ holdings, loading }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return holdings;
    return holdings.filter(
      (h) =>
        h.ticker.toLowerCase().includes(q) ||
        h.companyName.toLowerCase().includes(q)
    );
  }, [holdings, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800"><Skeleton className="h-4 w-24" /></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-4 border-t border-surface-800 flex gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40 ml-4" />
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
      {/* Header */}
      <div className="px-4 sm:px-5 py-4 border-b border-surface-800 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between flex-1">
          <h2 className="font-display font-600 text-sm text-surface-400 uppercase tracking-wider">Holdings</h2>
          <span className="text-xs text-surface-600 font-mono">
            {filtered.length}/{holdings.length} position{holdings.length !== 1 ? "s" : ""}
          </span>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-52">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search ticker or company..."
            className="input pl-8 text-xs py-1.5"
          />
        </div>
      </div>

      {holdings.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No holdings yet"
          description="Add your first buy transaction to see your portfolio here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description={`No holdings match "${search}"`} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-900/60">
                  <th className="table-header">Ticker</th>
                  <th className="table-header">Company</th>
                  <th className="table-header text-right">Shares</th>
                  <th className="table-header text-right">Avg Buy</th>
                  <th className="table-header text-right">
                    <span className="flex items-center justify-end gap-1">
                      Current
                      <AlertCircle size={10} className="text-surface-600" />
                    </span>
                  </th>
                  <th className="table-header text-right">Value</th>
                  <th className="table-header text-right">Unrealized P/L</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((h) => (
                  <tr key={h.ticker} className="hover:bg-surface-800/30 transition-colors duration-100">
                    <td className="table-cell">
                      <span className="font-mono font-500 text-sm" style={{ color: "var(--color-accent)" }}>
                        {h.ticker}
                      </span>
                    </td>
                    <td className="table-cell text-surface-300 text-sm">{h.companyName}</td>
                    <td className="table-cell text-right font-mono text-sm">{h.totalShares.toLocaleString()}</td>
                    <td className="table-cell text-right font-mono text-sm text-surface-300">
                      {formatLKR(h.weightedAvgBuyPrice)}
                    </td>
                    <td className="table-cell text-right font-mono text-sm">
                      {h.currentPrice !== null ? formatLKR(h.currentPrice) : (
                        <span className="text-surface-600 text-xs">No data</span>
                      )}
                    </td>
                    <td className="table-cell text-right font-mono text-sm text-surface-200">
                      {h.currentValue !== null ? formatLKR(h.currentValue) : formatLKR(h.totalCost)}
                    </td>
                    <td className="table-cell text-right">
                      <PLCell value={h.unrealizedPL} percent={h.plPercent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            {paginated.map((h) => <HoldingCard key={h.ticker} h={h} />)}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
