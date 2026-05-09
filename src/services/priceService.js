/**
 * CSE price service — routes through your Cloudflare Worker proxy.
 * Worker URL is stored in .env as VITE_CSE_PROXY_URL
 */

const PROXY = import.meta.env.VITE_CSE_PROXY_URL; // e.g. https://cse-proxy.yourname.workers.dev

async function csePost(endpoint, body = "") {
  const res = await fetch(`${PROXY}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  return res.json();
}

//  In-memory cache (5 min TTL) 
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchTodayPriceMap() {
  try {
    const data = await csePost("todaySharePrice");
    const list = data?.reqTodaySharePrice;
    if (!Array.isArray(list)) return null;

    const map = {};
    for (const item of list) {
      if (item.symbol && item.lastTradedPrice != null) {
        map[item.symbol] = item.lastTradedPrice;
      }
    }
    return map;
  } catch {
    return null;
  }
}

async function fetchSinglePrice(ticker) {
  try {
    const data = await csePost("companyInfoSummery", `symbol=${encodeURIComponent(ticker)}`);
    const price = data?.reqSymbolInfo?.lastTradedPrice;
    return price != null && price > 0 ? price : null;
  } catch {
    return null;
  }
}

//  Public API 

export async function fetchAllPrices(tickers = []) {
  const now = Date.now();

  if (!_cache || now - _cacheTime > CACHE_TTL) {
    _cache = await fetchTodayPriceMap();
    _cacheTime = now;
  }

  const prices = {};

  for (const ticker of tickers) {
    if (_cache?.[ticker] != null) {
      prices[ticker] = _cache[ticker];
    } else {
      const price = await fetchSinglePrice(ticker);
      if (price !== null) prices[ticker] = price;
    }
  }

  return prices;
}

export async function fetchPrice(ticker) {
  const result = await fetchAllPrices([ticker]);
  return result[ticker] ?? null;
}

export async function fetchMarketStatus() {
  try {
    const data = await csePost("marketStatus");
    return data?.marketStatus ?? null;
  } catch {
    return null;
  }
}