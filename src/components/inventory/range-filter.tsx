import { FilterOptions, TaxonomyFiltersProps } from "@/config/types";
import { CurrencyCode } from "@prisma/client";
import { RangeSelect } from "../ui/range-select";
import { useEffect, useState } from "react";
import { formatNumber, formatPrice } from "@/lib/utils";

interface RangeFilterProps extends TaxonomyFiltersProps {
  label: string;
  minName: string;
  maxName: string;
  defaultMin: number;
  defaultMax: number;
  increment?: number;
  thousandSeparator?: boolean;
  currency?: {
    currencyCode: CurrencyCode;
  };
}

export const RangeFilter = (prop: RangeFilterProps) => {
  const {
    label,
    minName,
    maxName,
    defaultMin,
    defaultMax,
    increment,
    thousandSeparator,
    currency,
    handleChange,
    searchParams,
  } = prop;

  const getInitialState = () => {
    const state: FilterOptions<string, number> = [];

    let iterator = defaultMin - (increment ?? 1);

    do {
      if (increment) {
        iterator += increment;
      } else {
        iterator++;
      }

      if (currency) {
        state.push({
          label: formatPrice({
            price: iterator,
            currency: currency.currencyCode,
          }),
          value: iterator,
        });
      } else if (thousandSeparator) {
        state.push({ label: formatNumber(iterator), value: iterator });
      } else {
        state.push({ label: iterator.toString(), value: iterator });
      }
    } while (iterator < defaultMax);
    // console.log(state);
    return state;
  };

  const initialState = getInitialState();

  const [minOptions, setMinOptions] =
    useState<FilterOptions<string, number>>(initialState);
  const [maxOptions, setMaxOptions] = useState<FilterOptions<string, number>>(
    initialState.toReversed()
  );

  // biome-ignore lint:
  useEffect(() => {
    if (searchParams?.[minName]) {
      setMaxOptions(
        initialState.filter(
          ({ value }) => value > Number(searchParams[minName])
        )
      );
    }
    if (searchParams?.[maxName]) {
      setMinOptions(
        initialState.filter(
          ({ value }) => value < Number(searchParams[maxName])
        )
      );
    }
  }, [searchParams?.[minName], searchParams?.[maxName]]);

  return (
    <RangeSelect
      label={label}
      minSelect={{
        name: minName,
        value: Number(searchParams?.[minName] || ""),
        options: minOptions,
        onChange: handleChange,
      }}
      maxSelect={{
        name: maxName,
        value: Number(searchParams?.[maxName] || ""),
        options: maxOptions,
        onChange: handleChange,
      }}
    />
  );
};
