import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { AwaitedPageProps, PageProps } from "@/config/types";
import db from "@/lib/db";

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

  return <div className="grid grid-cols-1">
    <ClassifiedList classifieds={classifieds} />
  </div>;
}
