import { useState, useMemo } from "react";
import { Trash2, ArrowUpCircle, ArrowDownCircle, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { formatLKR } from "../../calculations/portfolio";
import { EmptyState } from "../ui";
import { format, parseISO } from "date-fns";
import clsx from "clsx";

const PAGE_SIZE = 20;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try { return format(parseISO(dateStr), "dd MMM yyyy"); }
  catch { return dateStr; }
}

function TransactionCard({ tx, onDelete, loading }) {
  return (
    <div className="px-4 py-4 border-t border-surface-800/60 first:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={tx.type === "BUY" ? "badge-buy" : "badge-sell"}>
            {tx.type === "BUY" ? <ArrowUpCircle size={10} className="mr-1" /> : <ArrowDownCircle size={10} className="mr-1" />}
            {tx.type}
          </span>
          <span className="font-mono font-500 text-sm" style={{ color: "var(--color-accent)" }}>{tx.ticker}</span>
        </div>
        <button
          onClick={() => onDelete(tx.id)}
          disabled={loading}
          className="p-1.5 rounded-lg text-surface-600 hover:text-loss hover:bg-loss/10 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <p className="text-xs text-surface-400 mb-3 truncate">{tx.companyName}</p>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { label: "Date", val: formatDate(tx.date) },
          { label: "Qty", val: Number(tx.quantity).toLocaleString() },
          { label: "Price", val: formatLKR(tx.pricePerShare) },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>{label}</p>
            <p className="font-mono text-surface-300">{val}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-surface-800/40 flex justify-between items-center">
        <span className="text-surface-600 text-xs">Net Total</span>
        <span className="font-mono text-sm font-500 text-surface-100">{formatLKR(tx.netTotal)}</span>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Show max 5 page buttons around current page
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-surface-800">
      <p className="text-xs text-surface-600 font-mono">Page {page} of {totalPages}</p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {start > 1 && <span className="w-7 h-7 flex items-center justify-center text-surface-600 text-xs">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="w-7 h-7 rounded-lg text-xs font-mono transition-colors text-surface-500 hover:text-surface-200 hover:bg-surface-800"
            style={p === page ? { backgroundColor: "var(--color-accent)", color: "#fff" } : {}}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="w-7 h-7 flex items-center justify-center text-surface-600 text-xs">…</span>}
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

export default function TransactionTable({ transactions, onDelete, loading }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | BUY | SELL
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = transactions;
    if (typeFilter !== "ALL") list = list.filter((t) => t.type === typeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(
      (t) => t.ticker.toLowerCase().includes(q) || t.companyName.toLowerCase().includes(q)
    );
    return list;
  }, [transactions, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleType = (t) => { setTypeFilter(t); setPage(1); };

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={ArrowUpCircle}
        title="No transactions yet"
        description="Log your first buy or sell transaction to get started."
      />
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="px-4 sm:px-5 py-3 border-b border-surface-800 flex flex-col sm:flex-row gap-3">
        {/* Type filter pills */}
        <div className="flex gap-1.5 items-center">
          <Filter size={12} className="text-surface-600 shrink-0" />
          {["ALL", "BUY", "SELL"].map((t) => (
            <button
              key={t}
              onClick={() => handleType(t)}
              className={clsx(
                "px-3 py-1 rounded-lg text-xs font-mono font-500 transition-colors border",
                typeFilter === t
                  ? t === "BUY"
                    ? "bg-profit/15 text-profit border-profit/30"
                    : t === "SELL"
                    ? "bg-loss/15 text-loss border-loss/30"
                    : "border-surface-700 text-surface-200"
                  : "border-transparent text-surface-500 hover:text-surface-300 hover:border-surface-700"
              )}
              style={typeFilter === t && t === "ALL" ? { backgroundColor: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent)", borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)" } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-64 sm:ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search ticker or company..."
            className="input pl-8 text-xs py-1.5"
          />
        </div>

        <span className="text-xs text-surface-600 font-mono self-center hidden sm:block">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try a different search or filter." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-900/60">
                  <th className="table-header">Date</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Ticker</th>
                  <th className="table-header">Company</th>
                  <th className="table-header text-right">Qty</th>
                  <th className="table-header text-right">Price/Share</th>
                  <th className="table-header text-right">Gross</th>
                  <th className="table-header text-right">Fee</th>
                  <th className="table-header text-right">Net Total</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-800/30 transition-colors duration-100">
                    <td className="table-cell text-surface-400 text-xs font-mono whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="table-cell">
                      <span className={tx.type === "BUY" ? "badge-buy" : "badge-sell"}>
                        {tx.type === "BUY" ? <ArrowUpCircle size={10} className="mr-1" /> : <ArrowDownCircle size={10} className="mr-1" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono font-500 text-sm" style={{ color: "var(--color-accent)" }}>{tx.ticker}</span>
                    </td>
                    <td className="table-cell text-surface-300 text-sm max-w-[140px] truncate">{tx.companyName}</td>
                    <td className="table-cell text-right font-mono text-sm">{Number(tx.quantity).toLocaleString()}</td>
                    <td className="table-cell text-right font-mono text-sm text-surface-300">{formatLKR(tx.pricePerShare)}</td>
                    <td className="table-cell text-right font-mono text-sm text-surface-400">{formatLKR(tx.grossAmount)}</td>
                    <td className="table-cell text-right font-mono text-xs text-surface-500">{formatLKR(tx.fees)}</td>
                    <td className="table-cell text-right font-mono text-sm font-500 text-surface-100">{formatLKR(tx.netTotal)}</td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => onDelete(tx.id)}
                        disabled={loading}
                        className="p-1.5 rounded-lg text-surface-600 hover:text-loss hover:bg-loss/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            {paginated.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} onDelete={onDelete} loading={loading} />
            ))}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
