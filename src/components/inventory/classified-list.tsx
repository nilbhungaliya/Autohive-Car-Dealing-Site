import { ClassifiedWithImages, favourites } from "@/config/types";
import { Classified } from "@prisma/client";
import { ClassifiedCard } from "./classified-card";

interface ClassifiedListProps {
  classifieds: ClassifiedWithImages[];
  favourites: number[];
}

export const ClassifiedList = (props: ClassifiedListProps) => {
  const { classifieds, favourites } = props;

  return (
    <div className="grid grid=cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {classifieds.map((classified) => (
        <ClassifiedCard key={classified.id} classified={classified} favourites={favourites} />
      ))}
    </div>
  );
};
