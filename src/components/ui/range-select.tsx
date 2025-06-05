"use client";

import { FilterOptions } from "@/config/types";
import { SelectHTMLAttributes } from "react";

interface selectType extends SelectHTMLAttributes<HTMLSelectElement> {
  options: FilterOptions<string, number>;
}

interface RangeSelectProps {
  label: string;
  minSelect: selectType;
  maxSelect: selectType;
}

export const RangeSelect = (props: RangeSelectProps) => {
  const { label, minSelect, maxSelect } = props;

  return (
    <div className="text-foreground">
      <h4 className="text-sm font-semibold text-foreground"> {label}</h4>
      <div className="!mt-1 flex gap-2">
        <select
          {...minSelect}
          className="flex-1 w-full pl-3 py-2 border border-input rounded-md custom-select appearance-none pr-12 bg-no-repeat bg-background text-foreground"
        >
          <option value="" className="bg-card text-foreground">select</option>
          {minSelect.options.map((option) => {
            return (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            );
          })}
        </select>
        <select
          {...maxSelect}
          className="flex-1 w-full pl-3 py-2 border border-input rounded-md custom-select appearance-none pr-12 bg-no-repeat bg-background text-foreground"
        >
          <option value="" className="bg-card text-foreground">select</option>
          {maxSelect.options.map((option) => {
            return (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
