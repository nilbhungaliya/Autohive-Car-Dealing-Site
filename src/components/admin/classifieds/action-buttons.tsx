"use client";
import { deleteClassifiedAction } from "@/app/_actions/classified";
import { Button } from "@/components/ui/button";
import { ClassifiedWithImages } from "@/config/types";
import { useTransition } from "react";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import { EyeIcon, Loader2, PencilIcon, Trash } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

export const ActionButtons = ({
  classified,
}: {
  classified: ClassifiedWithImages;
}) => {
  const [isPending, startTransition] = useTransition();

  const deleteClassified = (id: number) => {
    startTransition(async () => {
      const result = await deleteClassifiedAction(id);
      if (result.success) {
        toast.success("Classified Deleted", {
          description: result.message,
        });
      } else {
        toast.error("Error Deleting Classified", {
          description: result.message,
        });
      }
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        className="p-2 h-fit"
        data-tooltip-id="trash-tooltip"
        data-tooltip-content="Delete"
        onClick={() => deleteClassified(classified.id)}
      >
        <Tooltip id="trash-tooltip" />
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4 outline-none" />
        )}
      </Button>
      <Button
        data-tooltip-id="view-tooltip"
        data-tooltip-content="View"
        className="p-2 h-fit"
        asChild
      >
        <Link href={routes.singleClassified(classified.slug)}>
          <Tooltip id="view-tooltip" />
          <EyeIcon className="h-4 w-4 outline-none" />
        </Link>
      </Button>
      <Button
        data-tooltip-id="edit-tooltip"
        data-tooltip-content="Edit"
        className="p-2 h-fit"
        asChild
      >
        <Link href={routes.admin.editClassified(classified.id)}>
          <Tooltip id="edit-tooltip" />
          <PencilIcon className="h-4 w-4 outline-none" />
        </Link>
      </Button>
    </>
  );
};
