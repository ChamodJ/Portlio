import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCapitalEntries,
  addCapitalEntry,
  deleteCapitalEntry,
} from "../services/capitalService";

export function useCapital() {
  return useQuery({
    queryKey: ["capital"],
    queryFn: getCapitalEntries,
  });
}

export function useAddCapital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCapitalEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["capital"] }),
  });
}

export function useDeleteCapital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCapitalEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["capital"] }),
  });
}
