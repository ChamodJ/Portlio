import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import {
  useCapital,
  useAddCapital,
  useDeleteCapital,
} from "../hooks/useCapital";
import CapitalTable from "../components/capital/CapitalTable";
import CapitalModal from "../components/capital/CapitalModal";
import { PageHeader, ConfirmDialog } from "../components/ui";
import { formatLKR } from "../calculations/portfolio";

export default function Capital() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: entries = [], isLoading } = useCapital();
  const addMutation = useAddCapital();
  const deleteMutation = useDeleteCapital();

  const handleAdd = async (data) => {
    await addMutation.mutateAsync(data);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  const totalDeposited = entries
    .filter((e) => e.type === "DEPOSIT")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalWithdrawn = entries
    .filter((e) => e.type === "WITHDRAWAL")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const netCapital = totalDeposited - totalWithdrawn;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <PageHeader
        title="Capital Tracker"
        subtitle="Track your investment deposits and withdrawals"
        action={
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} strokeWidth={2.5} />
            Add Entry
          </button>
        }
      />

      {/* Capital summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total Deposited", value: formatLKR(totalDeposited), color: "text-profit" },
          { label: "Total Withdrawn", value: formatLKR(totalWithdrawn), color: "text-loss" },
          { label: "Net Capital", value: formatLKR(netCapital), color: "text-accent" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className="text-xs font-display font-500 text-surface-500 uppercase tracking-wider mb-1.5">
              {label}
            </p>
            <p className={`font-display font-700 text-lg font-mono ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-surface-500 text-sm">
              <Wallet size={16} className="animate-pulse" />
              Loading entries...
            </div>
          </div>
        ) : (
          <CapitalTable
            entries={entries}
            onDelete={(id) => setDeleteTarget(id)}
            loading={deleteMutation.isPending}
          />
        )}
      </div>

      <CapitalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        loading={addMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Capital Entry"
        message="This will permanently delete this entry."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
