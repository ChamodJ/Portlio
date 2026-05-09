import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { formatLKR, formatPercent } from "../../calculations/portfolio";
import { Skeleton, EmptyState } from "../ui";
import clsx from "clsx";

function PLCell({ value, percent }) {
  if (value === null) {
    return <span className="neutral-text text-xs">—</span>;
  }
  const isPositive = value >= 0;
  const Icon = value === 0 ? Minus : isPositive ? TrendingUp : TrendingDown;
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5",
        isPositive ? "text-profit" : "text-loss"
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      <span className="font-mono text-sm">{formatLKR(value)}</span>
      {percent !== null && (
        <span className="text-xs opacity-70">{formatPercent(percent)}</span>
      )}
    </div>
  );
}

/* Mobile card for a single holding */
function HoldingCard({ h }) {
  const isPositive = h.unrealizedPL === null || h.unrealizedPL >= 0;
  return (
    <div className="px-4 py-4 border-t border-surface-800/60 first:border-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-mono font-600 text-accent text-sm">{h.ticker}</span>
          <p className="text-xs text-surface-400 mt-0.5 leading-tight">{h.companyName}</p>
        </div>
        <PLCell value={h.unrealizedPL} percent={h.plPercent} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Shares</p>
          <p className="font-mono text-surface-300">{h.totalShares.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Avg Buy</p>
          <p className="font-mono text-surface-300">{formatLKR(h.weightedAvgBuyPrice)}</p>
        </div>
        <div>
          <p className="text-surface-600 mb-0.5 uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Current</p>
          <p className="font-mono text-surface-300">
            {h.currentPrice !== null ? formatLKR(h.currentPrice) : <span className="text-surface-600">—</span>}
          </p>
        </div>
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

export default function HoldingsTable({ holdings, loading }) {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800">
          <Skeleton className="h-4 w-24" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-4 border-t border-surface-800 flex gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40 ml-4" />
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
      <div className="px-4 sm:px-5 py-4 border-b border-surface-800 flex items-center justify-between">
        <h2 className="font-display font-600 text-sm text-surface-400 uppercase tracking-wider">
          Holdings
        </h2>
        <span className="text-xs text-surface-600 font-mono">
          {holdings.length} position{holdings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {holdings.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No holdings yet"
          description="Add your first buy transaction to see your portfolio here."
        />
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
                      <AlertCircle size={10} className="text-surface-600" title="Live price via Yahoo Finance" />
                    </span>
                  </th>
                  <th className="table-header text-right">Value</th>
                  <th className="table-header text-right">Unrealized P/L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr
                    key={h.ticker}
                    className="hover:bg-surface-800/30 transition-colors duration-100"
                  >
                    <td className="table-cell">
                      <span className="font-mono font-500 text-accent text-sm">
                        {h.ticker}
                      </span>
                    </td>
                    <td className="table-cell text-surface-300 text-sm">
                      {h.companyName}
                    </td>
                    <td className="table-cell text-right font-mono text-sm">
                      {h.totalShares.toLocaleString()}
                    </td>
                    <td className="table-cell text-right font-mono text-sm text-surface-300">
                      {formatLKR(h.weightedAvgBuyPrice)}
                    </td>
                    <td className="table-cell text-right font-mono text-sm">
                      {h.currentPrice !== null ? (
                        formatLKR(h.currentPrice)
                      ) : (
                        <span className="text-surface-600 text-xs">No data</span>
                      )}
                    </td>
                    <td className="table-cell text-right font-mono text-sm text-surface-200">
                      {h.currentValue !== null
                        ? formatLKR(h.currentValue)
                        : formatLKR(h.totalCost)}
                    </td>
                    <td className="table-cell text-right">
                      <PLCell value={h.unrealizedPL} percent={h.plPercent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden">
            {holdings.map((h) => (
              <HoldingCard key={h.ticker} h={h} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
