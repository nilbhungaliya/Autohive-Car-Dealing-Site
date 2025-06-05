"use client";
import { ClassifiedWithImages} from "@/config/types";
import { Classified } from "@prisma/client";
import { ClassifiedCard } from "./classified-card";
import { use } from "react";

interface ClassifiedListProps {
  classifieds: Promise<ClassifiedWithImages[]>;
  favourites: number[];
}

export const ClassifiedList = (props: ClassifiedListProps) => {
  const { classifieds, favourites } = props;
  const inventory = use(classifieds);
  return (
    <div className="min-w-full grid grid=cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {inventory.map((classified) => (
        <ClassifiedCard key={classified.id} classified={classified} favourites={favourites} />
      ))}
    </div>
  );
};
