interface SkeletonLoaderProps {
  className?: string;
  isDarkMode: boolean;
}

export function SkeletonLoader({ className = '', isDarkMode }: SkeletonLoaderProps) {
  return (
    <div
      className={`animate-pulse rounded-lg ${
        isDarkMode ? 'bg-zinc-800' : 'bg-slate-200'
      } ${className}`}
    />
  );
}

export function TableSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonLoader className="w-10 h-10 rounded-full" isDarkMode={isDarkMode} />
          <div className="flex-1 space-y-2">
            <SkeletonLoader className="h-4 w-3/4" isDarkMode={isDarkMode} />
            <SkeletonLoader className="h-3 w-1/2" isDarkMode={isDarkMode} />
          </div>
          <SkeletonLoader className="h-8 w-24" isDarkMode={isDarkMode} />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
      <SkeletonLoader className="h-6 w-32 mb-4" isDarkMode={isDarkMode} />
      <SkeletonLoader className="h-10 w-full mb-2" isDarkMode={isDarkMode} />
      <SkeletonLoader className="h-4 w-24" isDarkMode={isDarkMode} />
    </div>
  );
}
