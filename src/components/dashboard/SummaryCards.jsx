import { TrendingUp, TrendingDown, Wallet, PieChart, DollarSign, RefreshCw } from "lucide-react";
import { formatLKR, formatPercent } from "../../calculations/portfolio";
import { Skeleton } from "../ui";
import clsx from "clsx";

function SummaryCard({ title, value, sub, icon: Icon, variant, delay, loading }) {
  const variants = {
    default: "text-surface-50",
    profit: "text-profit",
    loss: "text-loss",
    accent: "text-accent",
  };

  if (loading) {
    return (
      <div className="card p-4 sm:p-5">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "card p-4 sm:p-5 animate-fade-up opacity-0",
        `stagger-${delay}`
      )}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <p className="text-xs font-display font-500 text-surface-500 uppercase tracking-wider leading-tight">
          {title}
        </p>
        <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center shrink-0 ml-2">
          <Icon size={13} className="text-surface-400" />
        </div>
      </div>
      <p className={clsx("font-display font-700 text-lg sm:text-xl leading-tight mb-1 truncate", variants[variant])}>
        {value}
      </p>
      {sub && <p className="text-xs text-surface-600 truncate">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ summary, loading, pricesLoading, onRefreshPrices }) {
  const { totalInvested, portfolioValue, profitLoss, roi, availableCash } = summary || {};

  const isProfitable = profitLoss >= 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="font-display font-600 text-sm text-surface-400 uppercase tracking-wider">
          Overview
        </h2>
        <button
          onClick={onRefreshPrices}
          disabled={pricesLoading}
          className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-300 transition-colors"
        >
          <RefreshCw size={12} className={pricesLoading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{pricesLoading ? "Updating prices..." : "Refresh prices"}</span>
          <span className="sm:hidden">{pricesLoading ? "..." : "Refresh"}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Capital"
          value={formatLKR(totalInvested)}
          sub="Net deposited"
          icon={Wallet}
          variant="default"
          delay={1}
          loading={loading}
        />
        <SummaryCard
          title="Portfolio Value"
          value={formatLKR(portfolioValue)}
          sub="Based on market prices"
          icon={PieChart}
          variant="accent"
          delay={2}
          loading={loading}
        />
        <SummaryCard
          title="Unrealized P/L"
          value={formatLKR(profitLoss)}
          sub={formatPercent(roi) + " ROI"}
          icon={isProfitable ? TrendingUp : TrendingDown}
          variant={isProfitable ? "profit" : "loss"}
          delay={3}
          loading={loading}
        />
        <SummaryCard
          title="ROI"
          value={formatPercent(roi)}
          sub="Return on investment"
          icon={TrendingUp}
          variant={roi >= 0 ? "profit" : "loss"}
          delay={4}
          loading={loading}
        />
        <SummaryCard
          title="Available Cash"
          value={formatLKR(availableCash)}
          sub="Uninvested capital"
          icon={DollarSign}
          variant="default"
          delay={5}
          loading={loading}
        />
      </div>
    </div>
  );
}
