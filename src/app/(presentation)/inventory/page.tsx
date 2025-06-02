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
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />

      <div className="flex-1 bg-white p-4">
        <div className="space-y-2 items-center justify-between pb-4 -mt-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit text-black">
              We have found {count} classifieds
            </h2>
            <DialogFilters
              minMaxValues={minMaxResult}
              count={0}
              searchParams={searchParams}
            />
            <CustomPagination
              baseURL={routes.inventory}
              totalPages={totalPages}
              styles={{
                paginationRoot: "justify-end hidden lg:flex text-black",
                paginationPrevious: "hover:bg-slate-200 hover:text-black",
                paginationNext: "hover:bg-slate-200 hover:text-black",
                paginationLink:
                  "border-none active:border hover:text-black hover:bg-slate-200",
                paginationLinkActive: "bg-slate-200",
              }}
            />
          </div>
          <Suspense fallback={<InventorySkeleton />}>
            <ClassifiedList
              classifieds={classifieds}
              favourites={favourites ? favourites.ids : []}
            />
          </Suspense>
          <CustomPagination
            baseURL={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-center lg:hidden pt-12 text-black",
              paginationPrevious: "hover:bg-slate-200 hover:text-black",
              paginationNext: "hover:bg-slate-200 hover:text-black",
              paginationLink:
                "border-none active:border hover:bg-slate-200 hover:text-black",
              paginationLinkActive: "bg-slate-200",
            }}
          />
        </div>
      </div>
    </div>
  );
}
