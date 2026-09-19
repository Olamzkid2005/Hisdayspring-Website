export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-[60vh] flex items-center justify-center bg-surface"
    >
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
