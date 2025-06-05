import { PageSchema } from "@/app/schemas/page-schema";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { DialogFilters } from "@/components/inventory/dialog-filter";
import { InventorySkeleton } from "@/components/inventory/inventory-skeleton";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import db from "@/lib/db";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { buildClassfiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus, type Prisma } from "@prisma/client";
import { Suspense } from "react";
import { z } from "zod";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = PageSchema.parse(searchParams?.page);

  const page = validPage ? validPage : 1;

  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;

  return db.classified.findMany({
    where: buildClassfiedFilterQuery(searchParams),
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CLASSIFIEDS_PER_PAGE,
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = getInventory(searchParams);

  const count = await db.classified.count({
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
      year: true,
      price: true,
      odoReading: true,
    },
  });

  const sourceId = await getSourceId();

  const favourites = await redis.get<Favourites>(sourceId ?? "");

  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);
  const filterQuery = buildClassfiedFilterQuery(searchParams);

  // console.log({ favourites });

  return (
    <div className="flex min-h-screen bg-background mt-10">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-[1920px] mx-auto space-y-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                Available Cars
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                We have found {count} classifieds
              </p>
            </div>
            {/* <div className="flex items-center gap-4">
              <DialogFilters
                minMaxValues={minMaxResult}
                count={0}
                searchParams={searchParams}
              />
              <CustomPagination
                baseURL={routes.inventory}
                totalPages={totalPages}
                styles={{
                  paginationRoot: "justify-end hidden lg:flex text-foreground",
                  paginationPrevious:
                    "hover:bg-accent hover:text-accent-foreground",
                  paginationNext:
                    "hover:bg-accent hover:text-accent-foreground",
                  paginationLink:
                    "border-none active:border hover:text-accent-foreground hover:bg-accent",
                  paginationLinkActive: "bg-accent",
                }}
              />
            </div> */}
          </div>

          <div>
            <Suspense fallback={<InventorySkeleton />}>
              <ClassifiedList
                classifieds={classifieds}
                favourites={favourites ? favourites.ids : []}
              />
            </Suspense>
          </div>

          <div className="flex justify-center w-full border-t pt-8 mt-8">
            <CustomPagination
              baseURL={routes.inventory}
              totalPages={totalPages}
              styles={{
                paginationRoot: "justify-center text-foreground",
                paginationPrevious:
                  "hover:bg-accent hover:text-accent-foreground",
                paginationNext: "hover:bg-accent hover:text-accent-foreground",
                paginationLink:
                  "border-none active:border hover:bg-accent hover:text-accent-foreground",
                paginationLinkActive: "bg-accent",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
