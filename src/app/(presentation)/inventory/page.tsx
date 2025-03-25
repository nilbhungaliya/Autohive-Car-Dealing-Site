import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { AwaitedPageProps, favourites, PageProps } from "@/config/types";
import db from "@/lib/db";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";


const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) =>{
    return db.classified.findMany({
      include:{
        images: true
      }
    });
}

export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await db.classified.count();

    const sourceId = await getSourceId();

    const favourites = await redis.get<favourites>(sourceId ?? "");

    console.log({favourites});

  return <div className="grid grid-cols-1">
    <ClassifiedList classifieds={classifieds} favourites={favourites? favourites.ids:[]} />
  </div>;
}
