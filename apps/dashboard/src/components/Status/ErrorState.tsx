interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
      <div className="flex items-start gap-3">
        <span className="text-red-400 mt-0.5">⚠</span>
        <div>
          <p className="text-sm font-medium text-red-300">Analysis failed</p>
          <p className="text-sm text-red-400/60 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
