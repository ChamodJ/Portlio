import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { formatLKR } from "../../calculations/portfolio";
import { EmptyState } from "../ui";
import { format, parseISO } from "date-fns";

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
    <div className="overflow-x-auto">
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
                {tx.date
                  ? (() => {
                      try {
                        return format(parseISO(tx.date), "dd MMM yyyy");
                      } catch {
                        return tx.date;
                      }
                    })()
                  : "—"}
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
  );
}
