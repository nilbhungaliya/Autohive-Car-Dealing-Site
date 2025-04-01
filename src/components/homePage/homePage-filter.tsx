"use client";
import {SidebarProps } from "@/config/types";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent } from "react";
import { TaxonomyFilters } from "../inventory/taxonomy-filters";
import { RangeFilter } from "../inventory/range-filter";

interface HomepageTaxonomyFilterProps extends SidebarProps {}

export const HomepageTaxonomyFilter = ({ searchParams, minMaxValues }: HomepageTaxonomyFilterProps) => {
  const [state, setStates] = useQueryStates({
    make: parseAsString.withDefault(""),
    model: parseAsString.withDefault(""),
    modelVariant: parseAsString.withDefault(""),
    minYear: parseAsString.withDefault(""),
    maxYear: parseAsString.withDefault(""),
    minPrice: parseAsString.withDefault(""),
    maxPrice: parseAsString.withDefault(""),
  }, { shallow: false });

  const { _min, _max } = minMaxValues;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "make":
        setStates({
          make: value,
          model: null,
          modelVariant: null,
        });
        break;
      case "model":
        setStates({
          model: value,
          modelVariant: null,
        });
        break;

      default:
        setStates({ [name]: value || null });
    }
  };

  return (
    <>
      <TaxonomyFilters
        handleChange={handleChange}
        searchParams={searchParams}
      />

      <RangeFilter
        label="Year"
        minName="minYear"
        maxName="maxYear"
        defaultMin={_min.year || 1925}
        defaultMax={_max.year || new Date().getFullYear()}
        handleChange={handleChange}
        searchParams={searchParams}
      />
      <RangeFilter
        label="Price"
        minName="minPrice"
        maxName="maxPrice"
        defaultMin={_min.price || 0}
        defaultMax={_max.price || 21474836}
        handleChange={handleChange}
        searchParams={searchParams}
        increment={1000000}
        thousandSeparator
        currency={{
          currencyCode: "GBP",
        }}
      />
    </>
  );
};
