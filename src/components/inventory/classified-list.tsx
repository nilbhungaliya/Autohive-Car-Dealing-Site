import { ClassifiedWithImages } from "@/config/types";
import { Classified } from "@prisma/client";
import { ClassifiedCard } from "./classified-card";

interface ClassifiedListProps {
  classifieds: ClassifiedWithImages[];
}

export const ClassifiedList = (props: ClassifiedListProps) => {
  const { classifieds } = props;

  return (
    <div className="grid grid=cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {classifieds.map((classified) => (
        <ClassifiedCard key={classified.id} classified={classified} />
      ))}
    </div>
  );
};
