import { RadioFilter } from "@/components/shared/radio-filter";
import type { AwaitedPageProps } from "@/config/types";
import { ClassifiedStatus } from "@prisma/client";
import { CreateClassifiedDialog } from "./create-classified-dialog";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import Link from "next/link";

export const AdminClassifiedsHeader = ({ searchParams }: AwaitedPageProps) => {
  return (
    <div className="flex flex-col p-6 space-y-4 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">All Classifieds</h1>
        <div className="flex items-center justify-between">
          <RadioFilter
            items={["ALL", ...Object.values(ClassifiedStatus)]}
            searchParams={searchParams}
          />
          <div className="flex gap-2">
            <Link href={routes.admin.createClassified}>
              <Button size="sm" variant="default">
                Manually Create Car
              </Button>
            </Link>
            <CreateClassifiedDialog />
          </div>
        </div>
      </div>
    </div>
  );
};
