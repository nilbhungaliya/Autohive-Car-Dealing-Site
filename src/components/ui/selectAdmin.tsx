import { cn } from "@/lib/utils";
import type { ChangeEvent, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  options: { label: string; value: string; className?: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  noDefault?: boolean;
}

export const SelectAdmin = (props: SelectProps) => {
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
    <div className={cn("mt-1 text-foreground bg-background", className)}>
      {label && (
        <h4 className="text-sm font-semibold text-white">{label}</h4>
      )}
      <div className="mt-1 bg-background">
        <select
          onChange={onChange}
          value={value ?? ""}
          className={cn(
            selectClassName,
            "disabled:!bg-muted w-full px-3 py-2 border-input border rounded-md focus:outline-hidden custom-select appearance-none pr-12 bg-no-repeat bg-transparent text-foreground"
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
