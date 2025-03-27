"use client";

import { FilterOptions, TaxonomyFiltersProps } from "@/config/types";
import { Select } from "../ui/select";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { object } from "zod";
import { endpoints } from "@/config/endpoints";

export const TaxonomyFilters = (props: TaxonomyFiltersProps) => {
  const { searchParams, handleChange } = props;

  const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
  const [models, setModels] = useState<FilterOptions<string, string>>([]);
  const [modelVariants, setModelVariants] = useState<
    FilterOptions<string, string>
  >([]);

  useEffect(() => {
    (async function fetchTaxonomyOptions() {
      const params = new URLSearchParams();

      for (const [k, v] of Object.entries(
        searchParams as Record<string, string>
      )) {
        if (v) params.set(k, v as string);
      }

      const url = new URL(endpoints.taxonomy, window.location.href);
      url.search = params.toString();

      const data = await api.get<{
        makes: FilterOptions<string, string>;
        models: FilterOptions<string, string>;
        modelVariants: FilterOptions<string, string>;
      }>(url.toString());

      setMakes(data.makes);
      setModels(data.models);
      setModelVariants(data.modelVariants);
    })();
  }, [searchParams]);

  return (
    <div>
      <Select
        label="Make"
        name="make"
        value={searchParams?.make as string}
        onChange={handleChange}
        options={makes}
      />

      <Select
        label="Model"
        name="model"
        value={searchParams?.model as string}
        onChange={handleChange}
        options={models}
        disabled={!models.length}
      />

      <Select
        label="Model Variant"
        name="modelVariant"
        value={searchParams?.modelVariant as string}
        options={modelVariants}
        onChange={handleChange}
        disabled={!modelVariants.length}
      />
    </div>
  );
};
