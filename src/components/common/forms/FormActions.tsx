type Props = {
  loading: boolean;

  submitLabel: string;

  loadingLabel?: string;

  message?: string;

  cancelHref?: string;

  submitVariant?:
    | "default"
    | "destructive";
};

export default function FormActions({
  loading,
  submitLabel,
  loadingLabel = "Saving...",
  message,
  cancelHref,
  submitVariant = "default",
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-t pt-6">
      <div className="flex items-center gap-3">
        {cancelHref && (
          <a
            href={cancelHref}
            className="rounded border px-5 py-2"
          >
            Cancel
          </a>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`rounded px-5 py-2 text-white disabled:opacity-50 ${
            submitVariant ===
            "destructive"
              ? "bg-red-600"
              : "bg-black"
          }`}
        >
          {loading
            ? loadingLabel
            : submitLabel}
        </button>
      </div>

      {message && (
        <p className="text-sm font-medium text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}