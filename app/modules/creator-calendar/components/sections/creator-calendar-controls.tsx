import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

type SegmentedControlProps = {
  items: Array<{ id: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type AvailabilitySwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type TimeSelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SegmentedControl({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn("flex rounded-full bg-[#f4f1fb] p-1.5", className)}>
      {items.map((item) => {
        const active = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all",
              active
                ? "bg-white text-[#895af6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                : "text-slate-500"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function AvailabilitySwitch({
  checked,
  onChange,
}: AvailabilitySwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors",
        checked ? "bg-[#895af6]" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "block size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function TimeSelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: TimeSelectFieldProps) {
  const normalizedValue = normalizeTimeValue(value);
  const selectOptions = normalizedValue && !options.includes(normalizedValue)
    ? [normalizedValue, ...options]
    : options;

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-[#f6f5f8]",
          disabled && "opacity-60"
        )}
      >
        <select
          value={normalizedValue}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none bg-transparent px-4 pr-10 text-sm font-semibold text-slate-900 outline-none disabled:cursor-not-allowed"
        >
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function normalizeTimeValue(value: string): string {
  const [hours = "00", minutes = "00"] = value.split(":");
  return `${hours}:${minutes}`;
}
