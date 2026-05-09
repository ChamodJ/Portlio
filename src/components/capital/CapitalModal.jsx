import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, FormField } from "../ui";

const freshDefaults = () => ({
  date: new Date().toISOString().split("T")[0],
  type: "DEPOSIT",
  description: "",
  amount: "",
});

export default function CapitalModal({ open, onClose, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: freshDefaults() });

  const type = watch("type");

  // Clear form every time modal opens
  useEffect(() => {
    if (open) reset(freshDefaults());
  }, [open, reset]);

  const handleClose = () => {
    reset(freshDefaults());
    onClose();
  };

  const onValid = (data) => {
    onSubmit({
      date: data.date,
      description: data.description.trim(),
      amount: Number(data.amount),
      type: data.type,
    });
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Capital Entry" size="sm">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2 p-1 bg-surface-800 rounded-xl">
          {["DEPOSIT", "WITHDRAWAL"].map((t) => (
            <label
              key={t}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-display font-600 cursor-pointer transition-all ${
                type === t
                  ? t === "DEPOSIT"
                    ? "bg-profit text-surface-950"
                    : "bg-loss text-surface-950"
                  : "text-surface-500 hover:text-surface-300"
              }`}
            >
              <input type="radio" value={t} className="sr-only" {...register("type")} />
              {t === "DEPOSIT" ? "Deposit" : "Withdrawal"}
            </label>
          ))}
        </div>

        <FormField label="Date" error={errors.date?.message}>
          <input type="date" className="input" {...register("date", { required: "Required" })} />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <input
            type="text"
            className="input"
            placeholder="Initial deposit, Bank transfer..."
            {...register("description", { required: "Required" })}
          />
        </FormField>

        <FormField label="Amount (Rs)" error={errors.amount?.message}>
          <input
            type="number"
            className="input font-mono"
            placeholder="5000.00"
            step="0.01"
            {...register("amount", { required: "Required", min: { value: 0.01, message: "Must be > 0" } })}
          />
        </FormField>

        <div className="flex gap-3 pt-2">
          <button type="button" className="btn-ghost flex-1" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? "Saving..." : "Add Entry"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
 

