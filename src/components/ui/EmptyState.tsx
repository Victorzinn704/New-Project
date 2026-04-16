import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isDarkMode: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, isDarkMode }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-zinc-800/50' : 'bg-slate-100'}`}>
        <Icon className={`w-12 h-12 ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`} />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 max-w-md ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
