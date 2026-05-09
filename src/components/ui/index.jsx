import { X } from "lucide-react";
import clsx from "clsx";

//  Modal 
export function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;

  const sizes = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className={clsx(
          "relative w-full card p-5 sm:p-6 shadow-2xl animate-fade-up",
          "rounded-t-2xl sm:rounded-2xl",
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-base text-surface-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-500 hover:text-surface-200 transition-colors p-1 rounded-lg hover:bg-surface-800"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

//  FormField 
export function FormField({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-loss mt-1">{error}</p>
      )}
    </div>
  );
}

//  Skeleton 
export function Skeleton({ className }) {
  return <div className={clsx("skeleton", className)} />;
}

//  Empty State 
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
          <Icon size={20} className="text-surface-500" />
        </div>
      )}
      <p className="font-display font-600 text-surface-300 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-surface-600 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

//  Page Header 
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6 md:mb-8">
      <div>
        <h1 className="font-display font-800 text-xl md:text-2xl text-surface-50 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-surface-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

//  Confirm Dialog 
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-surface-400 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-ghost" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-loss/10 text-loss border border-loss/30 rounded-xl text-sm hover:bg-loss/20 transition-colors disabled:opacity-50"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
