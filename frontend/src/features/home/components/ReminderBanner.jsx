export function ReminderBanner({
  message,
  reminderId,
  ackLoading,
  onAcknowledge,
  onDismiss,
}) {
  if (!message) return null;

  return (
    <div
      className="mb-3 rounded-2xl border border-amber-400/50 bg-amber-500/15 px-4 py-3 text-sm text-amber-50 flex flex-col sm:flex-row sm:items-center gap-3"
      role="status"
    >
      <p className="flex-1">{message}</p>
      <div className="flex gap-2 shrink-0">
        {reminderId != null && (
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-semibold disabled:opacity-50"
            disabled={ackLoading}
            onClick={onAcknowledge}
          >
            {ackLoading ? "…" : "Đã nhận"}
          </button>
        )}
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-white/15 text-xs"
          onClick={onDismiss}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
