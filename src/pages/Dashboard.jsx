import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTransactions } from "../hooks/useTransactions";
import { useCapital } from "../hooks/useCapital";
import { usePrices } from "../hooks/usePrices";
import {
  calculateHoldings,
  enrichWithPrices,
  calculateSummary,
} from "../calculations/portfolio";
import { saveSnapshot } from "../services/snapshotService";
import SummaryCards from "../components/dashboard/SummaryCards";
import HoldingsTable from "../components/dashboard/HoldingsTable";
import { PageHeader } from "../components/ui";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: capitalEntries = [], isLoading: capLoading } = useCapital();
  const qc = useQueryClient();

  // Derive holdings from transactions
  const holdings = calculateHoldings(transactions);
  const tickers = holdings.map((h) => h.ticker);

  const {
    data: prices = {},
    isLoading: pricesLoading,
    isFetching: pricesFetching,
  } = usePrices(tickers);

  // Enrich with live prices
  const enrichedHoldings = enrichWithPrices(holdings, prices);

  // Summary calculations
  const summary = calculateSummary(enrichedHoldings, capitalEntries);

  const isLoading = txLoading || capLoading;

  // Save daily snapshot once data is ready
  useEffect(() => {
    if (!isLoading && enrichedHoldings.length > 0) {
      saveSnapshot({
        portfolioValue: summary.portfolioValue,
        investedCapital: summary.totalInvested,
        profitLoss: summary.profitLoss,
      }).catch(() => {}); // Silent fail — snapshot is non-critical
    }
  }, [isLoading]); // eslint-disable-line

  const handleRefreshPrices = () => {
    qc.invalidateQueries({ queryKey: ["prices"] });
  };

  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={today}
      />

      <SummaryCards
        summary={summary}
        loading={isLoading}
        pricesLoading={pricesLoading || pricesFetching}
        onRefreshPrices={handleRefreshPrices}
      />

      <HoldingsTable
        holdings={enrichedHoldings}
        loading={isLoading}
      />
    </div>
  );
}
