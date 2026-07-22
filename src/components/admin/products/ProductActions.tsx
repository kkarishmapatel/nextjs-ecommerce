type Props = {
  loading: boolean;
};

export default function ProductActions({
  loading,
}: Props) {
  return (
    <button
      disabled={loading}
      className="rounded bg-black px-6 py-3 text-white"
    >
      {loading ? "Saving..." : "Save Draft"}
    </button>
  );
}