import { useQuery } from "@tanstack/react-query";
import { fetchAllPrices } from "../services/priceService";

export function usePrices(tickers = []) {
  return useQuery({
    queryKey: ["prices", tickers.sort().join(",")],
    queryFn: () => fetchAllPrices(tickers),
    enabled: tickers.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    placeholderData: {},
  });
}
