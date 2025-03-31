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
import { ClassifiedStatus, type Prisma } from "@prisma/client";
import { Suspense } from "react";
import { z } from "zod";

const pageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();

const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  colour: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
});

const buildeClassfiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);
  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };

  const numFilters = ["seats", "doors"];

  const enumFilters = [
    "odoUnit",
    "currency",
    "transmission",
    "bodyType",
    "fuelType",
    "colour",
    "ulezCompliance",
  ];

  const mapParamsToFilter = keys.reduce((acc, key) => {
    const value = searchParams?.[key] as string | undefined;
    if (!value) return acc;
    if (taxonomyFilters.includes(key)) {
      acc[key] = { id: Number(value) };
    }
    if (numFilters.includes(key)) {
      acc[key] = { id: Number(value) };
    }
    if (enumFilters.includes(key)) {
      acc[key] = value.toUpperCase();
    }
    if (key in rangeFilters) {
      const field = rangeFilters[key as keyof typeof rangeFilters];
      acc[field] = acc[field] || {};
      if (key.startsWith("min")) {
        acc[field].gte = Number(value);
      } else if (key.startsWith("max")) {
        acc[field].lte = Number(value);
      }
    }
    return acc;
  }, {} as { [key: string]: any });

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...mapParamsToFilter,
  };
};

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = pageSchema.parse(searchParams?.page);

  const page = validPage ? validPage : 1;

  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;

  return db.classified.findMany({
    where: buildeClassfiedFilterQuery(searchParams),
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
    where: buildeClassfiedFilterQuery(searchParams),
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
  const filterQuery = buildeClassfiedFilterQuery(searchParams);

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
