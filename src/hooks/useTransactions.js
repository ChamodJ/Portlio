import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../services/transactionService";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}

export function useAddTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
