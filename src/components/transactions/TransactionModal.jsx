import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Modal, FormField } from "../ui";
import { calcFee, calcNetTotal, formatLKR } from "../../calculations/portfolio";

const DEFAULT_FEE = 1.12;

export default function TransactionModal({ open, onClose, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "BUY",
      feePercent: DEFAULT_FEE,
      quantity: "",
      pricePerShare: "",
      netTotal: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const quantity = useWatch({ control, name: "quantity" });
  const pricePerShare = useWatch({ control, name: "pricePerShare" });
  const feePercent = useWatch({ control, name: "feePercent" });

  // Auto-calculate net total when inputs change
  useEffect(() => {
    const qty = Number(quantity);
    const pps = Number(pricePerShare);
    const fp = Number(feePercent) || DEFAULT_FEE;
    if (qty > 0 && pps > 0) {
      const gross = qty * pps;
      const net = calcNetTotal(gross, fp, type);
      setValue("netTotal", net.toFixed(2));
    }
  }, [quantity, pricePerShare, feePercent, type, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onValid = (data) => {
    const qty = Number(data.quantity);
    const pps = Number(data.pricePerShare);
    const fp = Number(data.feePercent);
    const gross = qty * pps;
    const fees = calcFee(gross, fp);

    onSubmit({
      date: data.date,
      ticker: data.ticker.toUpperCase().trim(),
      companyName: data.companyName.trim(),
      type: data.type,
      quantity: qty,
      pricePerShare: pps,
      feePercent: fp,
      grossAmount: gross,
      fees,
      netTotal: Number(data.netTotal),
    });
  };

  const qty = Number(quantity);
  const pps = Number(pricePerShare);
  const fp = Number(feePercent) || DEFAULT_FEE;
  const gross = qty > 0 && pps > 0 ? qty * pps : 0;
  const fees = gross ? calcFee(gross, fp) : 0;

  return (
    <Modal open={open} onClose={handleClose} title="Add Transaction" size="md">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2 p-1 bg-surface-800 rounded-xl">
          {["BUY", "SELL"].map((t) => (
            <label
              key={t}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-display font-600 cursor-pointer transition-all ${
                type === t
                  ? t === "BUY"
                    ? "bg-profit text-surface-950"
                    : "bg-loss text-surface-950"
                  : "text-surface-500 hover:text-surface-300"
              }`}
            >
              <input
                type="radio"
                value={t}
                className="sr-only"
                {...register("type")}
              />
              {t}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date" error={errors.date?.message}>
            <input
              type="date"
              className="input"
              {...register("date", { required: "Required" })}
            />
          </FormField>

          <FormField label="Ticker Symbol" error={errors.ticker?.message}>
            <input
              type="text"
              className="input font-mono uppercase"
              placeholder="SAMP.N0000"
              {...register("ticker", { required: "Required" })}
            />
          </FormField>
        </div>

        <FormField label="Company Name" error={errors.companyName?.message}>
          <input
            type="text"
            className="input"
            placeholder="Sampath Bank PLC"
            {...register("companyName", { required: "Required" })}
          />
        </FormField>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <FormField label="Quantity" error={errors.quantity?.message}>
            <input
              type="number"
              className="input"
              placeholder="100"
              min="1"
              step="1"
              {...register("quantity", {
                required: "Required",
                min: { value: 1, message: "Min 1" },
              })}
            />
          </FormField>

          <FormField label="Price / Share (Rs)" error={errors.pricePerShare?.message}>
            <input
              type="number"
              className="input"
              placeholder="150.00"
              step="0.01"
              {...register("pricePerShare", {
                required: "Required",
                min: { value: 0.01, message: "Must be > 0" },
              })}
            />
          </FormField>

          <FormField label="Fee %" error={errors.feePercent?.message}>
            <input
              type="number"
              className="input"
              step="0.01"
              {...register("feePercent", { required: "Required" })}
            />
          </FormField>
        </div>

        {/* Calculation breakdown */}
        {gross > 0 && (
          <div className="bg-surface-800/60 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-surface-400">
              <span>Gross Amount</span>
              <span className="font-mono">{formatLKR(gross)}</span>
            </div>
            <div className="flex justify-between text-surface-400">
              <span>Platform Fee ({fp}%)</span>
              <span className="font-mono text-loss">+ {formatLKR(fees)}</span>
            </div>
            <div className="h-px bg-surface-700" />
            <div className="flex justify-between font-display font-600 text-surface-200">
              <span>Net Total</span>
              <span className="font-mono text-accent">{formatLKR(Number(gross) + (type === "BUY" ? fees : -fees))}</span>
            </div>
          </div>
        )}

        <FormField label="Net Total (Rs) — editable" error={errors.netTotal?.message}>
          <input
            type="number"
            className="input font-mono"
            step="0.01"
            {...register("netTotal", { required: "Required" })}
          />
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="btn-ghost flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? "Saving..." : `Add ${type} Transaction`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
