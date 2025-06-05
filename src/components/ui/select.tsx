import { cn } from "@/lib/utils";
import type { ChangeEvent, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  noDefault?: boolean;
}

export const Select = (props: SelectProps) => {
  const {
    label,
    value,
    options,
    onChange,
    className,
    selectClassName,
    noDefault = true,
    ...rest
  } = props;

  return (
    <div className={cn("mt-1", className)}>
      {label && (
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
      )}
      <div className="mt-1">
        <select
          onChange={onChange}
          value={value ?? ""}
          className={cn(
            selectClassName,
            "disabled:!bg-muted w-full px-3 py-2 border-input border rounded-md focus:outline-hidden custom-select appearance-none pr-12 bg-no-repeat bg-background text-foreground"
          )}
          {...rest}
        >
          {noDefault && (
            <option value="" className="bg-card text-foreground">
              Select
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-card text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
