import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { formatLKR } from "../../calculations/portfolio";
import { EmptyState } from "../ui";
import { format, parseISO } from "date-fns";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

/* Mobile card for a single transaction */
function TransactionCard({ tx, onDelete, loading }) {
  return (
    <div className="px-4 py-4 border-t border-surface-800/60 first:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={tx.type === "BUY" ? "badge-buy" : "badge-sell"}>
            {tx.type === "BUY" ? (
              <ArrowUpCircle size={10} className="mr-1" />
            ) : (
              <ArrowDownCircle size={10} className="mr-1" />
            )}
            {tx.type}
          </span>
          <span className="font-mono font-500 text-accent text-sm">{tx.ticker}</span>
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
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Date</p>
          <p className="font-mono text-surface-300">{formatDate(tx.date)}</p>
        </div>
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Qty</p>
          <p className="font-mono text-surface-300">{Number(tx.quantity).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Price</p>
          <p className="font-mono text-surface-300">{formatLKR(tx.pricePerShare)}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-surface-800/40 flex justify-between items-center">
        <span className="text-surface-600 text-xs">Net Total</span>
        <span className="font-mono text-sm font-500 text-surface-100">{formatLKR(tx.netTotal)}</span>
      </div>
    </div>
  );
}

export default function TransactionTable({ transactions, onDelete, loading }) {
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
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-surface-800/30 transition-colors duration-100"
              >
                <td className="table-cell text-surface-400 text-xs font-mono whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="table-cell">
                  <span className={tx.type === "BUY" ? "badge-buy" : "badge-sell"}>
                    {tx.type === "BUY" ? (
                      <ArrowUpCircle size={10} className="mr-1" />
                    ) : (
                      <ArrowDownCircle size={10} className="mr-1" />
                    )}
                    {tx.type}
                  </span>
                </td>
                <td className="table-cell">
                  <span className="font-mono font-500 text-accent text-sm">
                    {tx.ticker}
                  </span>
                </td>
                <td className="table-cell text-surface-300 text-sm max-w-[140px] truncate">
                  {tx.companyName}
                </td>
                <td className="table-cell text-right font-mono text-sm">
                  {Number(tx.quantity).toLocaleString()}
                </td>
                <td className="table-cell text-right font-mono text-sm text-surface-300">
                  {formatLKR(tx.pricePerShare)}
                </td>
                <td className="table-cell text-right font-mono text-sm text-surface-400">
                  {formatLKR(tx.grossAmount)}
                </td>
                <td className="table-cell text-right font-mono text-xs text-surface-500">
                  {formatLKR(tx.fees)}
                </td>
                <td className="table-cell text-right font-mono text-sm font-500 text-surface-100">
                  {formatLKR(tx.netTotal)}
                </td>
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

      {/* Mobile card list */}
      <div className="md:hidden">
        {transactions.map((tx) => (
          <TransactionCard key={tx.id} tx={tx} onDelete={onDelete} loading={loading} />
        ))}
      </div>
    </>
  );
}
