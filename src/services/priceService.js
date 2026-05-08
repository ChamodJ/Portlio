/**
 * CSE price fetching.
 * CSE does not have an official public API.
 * Yahoo Finance supports .CM suffix for some CSE stocks (e.g., SAMP.CM).
 * This tries Yahoo via a CORS proxy, falls back to last known / manual prices.
 *
 * IMPORTANT: Replace CORS_PROXY with allorigins or your own proxy if needed.
 */

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// Map CSE tickers to Yahoo Finance symbols
const YAHOO_TICKER_MAP = {
  "SAMP.N0000": "SAMP.CM",
  "JKH.N0000": "JKH.CM",
  "LMF.N0000": "LMF.CM",
  "KZOO.N0000": "KZOO.CM",
  // Add more as needed
};

export async function fetchPrice(cseTicker) {
  const yahooSymbol = YAHOO_TICKER_MAP[cseTicker];
  if (!yahooSymbol) return null;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`;
    const res = await fetch(CORS_PROXY + encodeURIComponent(url));
    const data = await res.json();
    const price =
      data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
    return price;
  } catch {
    return null; // Silently fail, show "--" in UI
  }
}

export async function fetchAllPrices(tickers) {
  const results = await Promise.allSettled(
    tickers.map(async (t) => ({ ticker: t, price: await fetchPrice(t) }))
  );

  const prices = {};
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.price !== null) {
      prices[r.value.ticker] = r.value.price;
    }
  }
  return prices;
}