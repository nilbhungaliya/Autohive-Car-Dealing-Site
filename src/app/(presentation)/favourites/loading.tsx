import { InventorySkeleton } from "@/components/inventory/inventory-skeleton";

export default function FavouritesLoading(){
  return (
    <div className="container mx-auto px-4 py-8 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-6 text-black">Your Favourite Classifieds</h1>
      <InventorySkeleton />
    </div>
  );
};