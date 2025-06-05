import { imageSources } from "@/config/constants";
import { AwaitedPageProps } from "@/config/types";
import db from "@/lib/db";
import { imgixLoader } from "@/lib/imgix-loader";
import { buildClassfiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus } from "@prisma/client";
import { HomepageTaxonomyFilter } from "./homePage-filter";
import { SearchButton } from "./search-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { routes } from "@/config/routes";
import { HeroClient } from "./hero-client";

export const HeroSection = async (props: AwaitedPageProps) => {
  const { searchParams } = props;
  const totalFiltersApplied = Object.keys(searchParams || {}).length;
  const isFilterApplied = totalFiltersApplied > 0;

  const classifiedsCount = await db.classified.count({
    where: buildClassfiedFilterQuery(searchParams),
  });

  const minMaxResult = await db.classified.aggregate({
    where: { status: ClassifiedStatus.LIVE },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      price: true,
      year: true,
      odoReading: true,
    },
  });

  // Create static data for client component
  const staticRoutes = {
    home: routes.home,
    inventory: routes.inventory,
  };

  const backgroundImageUrl = imgixLoader({
    src: imageSources.carLineup,
    width: 1920,
    quality: 90,
  });

  return (
    <HeroClient
      searchParams={searchParams}
      totalFiltersApplied={totalFiltersApplied}
      isFilterApplied={isFilterApplied}
      classifiedsCount={classifiedsCount}
      minMaxResult={minMaxResult}
      routes={staticRoutes}
      backgroundImageUrl={backgroundImageUrl}
    />
  );
};
