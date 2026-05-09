/**
 * Core portfolio calculations.
 * All holdings are DERIVED from transaction history — never stored directly.
 */

/**
 * Calculate holdings map from raw transactions.
 * Uses weighted average cost basis.
 * Returns array of holding objects for active positions only.
 */
export function calculateHoldings(transactions) {
  const holdingsMap = {};

  // Sort oldest first so we build up the cost basis chronologically
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  for (const tx of sorted) {
    const { ticker, companyName, type, quantity, pricePerShare, fees = 0 } = tx;
    const qty = Number(quantity);
    const pps = Number(pricePerShare);
    const fee = Number(fees);

    if (!holdingsMap[ticker]) {
      holdingsMap[ticker] = {
        ticker,
        companyName,
        totalShares: 0,
        totalCost: 0,
      };
    }

    const h = holdingsMap[ticker];

    if (type === "BUY") {
      // Cost includes the fee on buy side
      h.totalCost += qty * pps + fee;
      h.totalShares += qty;
    } else if (type === "SELL") {
      if (h.totalShares <= 0) continue;
      // Proportionally reduce cost basis
      const avgCostPerShare = h.totalCost / h.totalShares;
      h.totalCost -= avgCostPerShare * qty;
      h.totalShares -= qty;
      // Clamp to prevent floating point negatives
      if (h.totalShares < 0.0001) h.totalShares = 0;
      if (h.totalCost < 0) h.totalCost = 0;
    }
  }

  return Object.values(holdingsMap)
    .filter((h) => h.totalShares > 0.0001)
    .map((h) => ({
      ...h,
      totalShares: Math.round(h.totalShares * 10000) / 10000,
      weightedAvgBuyPrice:
        h.totalShares > 0 ? h.totalCost / h.totalShares : 0,
    }));
}

/**
 * Enrich holdings with live prices and compute P/L.
 */
export function enrichWithPrices(holdings, prices = {}) {
  return holdings.map((h) => {
    const currentPrice = prices[h.ticker] ?? null;
    const currentValue =
      currentPrice !== null ? currentPrice * h.totalShares : null;
    const unrealizedPL =
      currentValue !== null ? currentValue - h.totalCost : null;
    const plPercent =
      unrealizedPL !== null && h.totalCost > 0
        ? (unrealizedPL / h.totalCost) * 100
        : null;

    return { ...h, currentPrice, currentValue, unrealizedPL, plPercent };
  });
}

/**
 * Calculate summary stats for dashboard cards.
 */
export function calculateSummary(holdings, capitalEntries) {
  const totalDeposited = capitalEntries
    .filter((c) => c.type === "DEPOSIT")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const totalWithdrawn = capitalEntries
    .filter((c) => c.type === "WITHDRAWAL")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const totalInvested = totalDeposited - totalWithdrawn;

  const totalCostBasis = holdings.reduce((sum, h) => sum + h.totalCost, 0);

  const portfolioValue = holdings.reduce((sum, h) => {
    return sum + (h.currentValue !== null ? h.currentValue : h.totalCost);
  }, 0);

  const availableCash = totalInvested - totalCostBasis;

  const profitLoss = portfolioValue - totalCostBasis;

  const roi =
    totalCostBasis > 0 ? (profitLoss / totalCostBasis) * 100 : 0;

  return {
    totalInvested,
    totalDeposited,
    totalWithdrawn,
    portfolioValue,
    availableCash,
    profitLoss,
    roi,
    totalCostBasis,
  };
}

/**
 * Calculate fee amount from gross and fee percent.
 */
export function calcFee(grossAmount, feePercent = 1.12) {
  return (Number(grossAmount) * Number(feePercent)) / 100;
}

/**
 * Calculate net total for BUY (gross + fee) or SELL (gross - fee).
 */
export function calcNetTotal(grossAmount, feePercent = 1.12, type = "BUY") {
  const fee = calcFee(grossAmount, feePercent);
  return type === "BUY"
    ? Number(grossAmount) + fee
    : Number(grossAmount) - fee;
}

/**
 * Format currency in Sri Lankan Rupees.
 */
export function formatLKR(amount, compact = false) {
  if (amount === null || amount === undefined) return "—";
  if (compact && Math.abs(amount) >= 1000) {
    return `Rs ${(amount / 1000).toFixed(1)}k`;
  }
  return `Rs ${Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format percent with sign.
 */
export function formatPercent(value) {
  if (value === null || value === undefined) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
