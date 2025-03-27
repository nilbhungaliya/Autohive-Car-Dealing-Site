import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { Pagination } from "@/components/ui/pagination";
import { CLASSIFIEDS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, favourites, PageProps } from "@/config/types";
import db from "@/lib/db";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { z } from "zod";

const pageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = pageSchema.parse(searchParams?.page);

  const page = validPage ? validPage : 1;

  const offset = (page - 1) * CLASSIFIEDS_PER_PAGE;

  return db.classified.findMany({
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CLASSIFIEDS_PER_PAGE,
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await db.classified.count();

  const sourceId = await getSourceId();

  const favourites = await redis.get<favourites>(sourceId ?? "");

  const totalPages = Math.ceil(count / CLASSIFIEDS_PER_PAGE);

  console.log({ favourites });

  return (
    <div className="flex">
      <Sidebar minMaxValues={null} searchParams={searchParams} />

      <div className="flex-1 bg-white p-4">
        <div className="space-y-2 items-center justify-between pb-4 -mt-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit text-black">
              We have found {count} classifieds
            </h2>
            {/* <DialoagFilters /> */}
          </div>
          <CustomPagination
            baseURL={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end hidden lg:flex text-black",
              paginationPrevious: "hover:bg-slate-200 hover:text-black",
              paginationNext: "hover:bg-slate-200 hover:text-black",
              paginationLink:
                "border-none active:border hover:bg-slate-200 hover:text-black",
              paginationLinkActive: "bg-slate-200",
            }}
          />
          <ClassifiedList
            classifieds={classifieds}
            favourites={favourites ? favourites.ids : []}
          />
        </div>
      </div>
    </div>
  );
}
