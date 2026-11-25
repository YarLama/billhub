import { useId, type ComponentProps } from 'react';

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = ({
  label = '',
  id,
  error,
  className = '',
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <div className="relative flex items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            className={`peer sr-only ${className}`}
            {...props}
          />
          <div className="w-5 h-5 rounded-md border border-zinc-600 bg-zinc-800/80 transition-all duration-150 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/40 group-hover:border-zinc-500" />
          <svg
            viewBox="0 0 12 10"
            fill="none"
            className="w-3 h-3 text-zinc-950 absolute opacity-0 scale-75 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100 pointer-events-none"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {label && (
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>

      {error?.trim() && (
        <p className="text-xs text-rose-400 mt-0.5">{error}</p>
      )}
    </div>
  );
};
