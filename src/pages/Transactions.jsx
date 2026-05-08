import { useState } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import {
  useTransactions,
  useAddTransaction,
  useDeleteTransaction,
} from "../hooks/useTransactions";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionModal from "../components/transactions/TransactionModal";
import { PageHeader, ConfirmDialog } from "../components/ui";

export default function Transactions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: transactions = [], isLoading } = useTransactions();
  const addMutation = useAddTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleAdd = async (data) => {
    await addMutation.mutateAsync(data);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  // Summary stats for the page header area
  const buyCount = transactions.filter((t) => t.type === "BUY").length;
  const sellCount = transactions.filter((t) => t.type === "SELL").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Transactions"
        subtitle={`${buyCount} buy · ${sellCount} sell · ${transactions.length} total`}
        action={
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} strokeWidth={2.5} />
            Add Transaction
          </button>
        }
      />

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-surface-500 text-sm">
              <ArrowLeftRight size={16} className="animate-pulse" />
              Loading transactions...
            </div>
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onDelete={(id) => setDeleteTarget(id)}
            loading={deleteMutation.isPending}
          />
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        loading={addMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="This will permanently delete this transaction. Holdings will be recalculated automatically."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
