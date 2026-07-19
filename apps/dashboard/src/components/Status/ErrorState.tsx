interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 animate-[slideUp_0.2s_ease-out]"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">
          ⚠
        </span>
        <div>
          <p className="text-sm font-medium text-red-300">
            Analysis failed
          </p>
          <p className="text-sm text-red-400/60 mt-1">{message}</p>
          <p className="text-xs text-red-400/40 mt-2">
            Check that the API server is running and try again.
          </p>
        </div>
      </div>
    </div>
  );
}
