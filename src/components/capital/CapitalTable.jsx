import { Trash2, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { formatLKR } from "../../calculations/portfolio";
import { EmptyState } from "../ui";
import { format, parseISO } from "date-fns";
import clsx from "clsx";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

/* Mobile card for a single capital entry */
function CapitalCard({ entry, onDelete, loading }) {
  return (
    <div className="px-4 py-4 border-t border-surface-800/60 first:border-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-500 border",
              entry.type === "DEPOSIT"
                ? "bg-profit/10 text-profit border-profit/20"
                : "bg-loss/10 text-loss border-loss/20"
            )}
          >
            {entry.type === "DEPOSIT" ? (
              <ArrowDownCircle size={10} />
            ) : (
              <ArrowUpCircle size={10} />
            )}
            {entry.type}
          </span>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          disabled={loading}
          className="p-1.5 rounded-lg text-surface-600 hover:text-loss hover:bg-loss/10 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <p className="text-sm text-surface-300 mb-2">{entry.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-surface-500">{formatDate(entry.date)}</span>
        <span
          className={clsx(
            "font-mono font-500 text-sm",
            entry.type === "DEPOSIT" ? "text-profit" : "text-loss"
          )}
        >
          {entry.type === "WITHDRAWAL" ? "−" : "+"}
          {formatLKR(entry.amount)}
        </span>
      </div>
    </div>
  );
}

export default function CapitalTable({ entries, onDelete, loading }) {
  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No capital entries yet"
        description="Add your first deposit to start tracking your investment capital."
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-900/60">
              <th className="table-header">Date</th>
              <th className="table-header">Type</th>
              <th className="table-header">Description</th>
              <th className="table-header text-right">Amount</th>
              <th className="table-header"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-surface-800/30 transition-colors duration-100"
              >
                <td className="table-cell text-surface-400 text-xs font-mono whitespace-nowrap">
                  {formatDate(entry.date)}
                </td>
                <td className="table-cell">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-500 border",
                      entry.type === "DEPOSIT"
                        ? "bg-profit/10 text-profit border-profit/20"
                        : "bg-loss/10 text-loss border-loss/20"
                    )}
                  >
                    {entry.type === "DEPOSIT" ? (
                      <ArrowDownCircle size={10} />
                    ) : (
                      <ArrowUpCircle size={10} />
                    )}
                    {entry.type}
                  </span>
                </td>
                <td className="table-cell text-surface-300 text-sm">
                  {entry.description}
                </td>
                <td
                  className={clsx(
                    "table-cell text-right font-mono font-500 text-sm",
                    entry.type === "DEPOSIT" ? "text-profit" : "text-loss"
                  )}
                >
                  {entry.type === "WITHDRAWAL" ? "−" : "+"}
                  {formatLKR(entry.amount)}
                </td>
                <td className="table-cell text-right">
                  <button
                    onClick={() => onDelete(entry.id)}
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

      {/* Mobile card list */}
      <div className="md:hidden">
        {entries.map((entry) => (
          <CapitalCard key={entry.id} entry={entry} onDelete={onDelete} loading={loading} />
        ))}
      </div>
    </>
  );
}
