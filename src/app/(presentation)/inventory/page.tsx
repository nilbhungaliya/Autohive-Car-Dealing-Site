import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { Pagination } from "@/components/ui/pagination";
import { routes } from "@/config/routes";
import { AwaitedPageProps, favourites, PageProps } from "@/config/types";
import db from "@/lib/db";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return db.classified.findMany({
    include: {
      images: true,
    },
  });
};

export default async function InventoryPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await db.classified.count();

  const sourceId = await getSourceId();

  const favourites = await redis.get<favourites>(sourceId ?? "");

  console.log({ favourites });

  return (
    <div className="flex">
      {/* <Sidebar /> */}

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
						totalPages={15}
						styles={{
							paginationRoot: "justify-end hidden lg:flex",
							paginationPrevious: "",
							paginationNext: "",
							paginationLink: "border-none active:border text-black",
							paginationLinkActive: "",
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
