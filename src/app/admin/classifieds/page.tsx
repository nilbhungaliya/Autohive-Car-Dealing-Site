import { validatePagination } from "@/app/schemas/pagination-schema";
import { AdminClassifiedFilterSchema } from "@/app/schemas/table-filter-schema";
import {
  ClassifiedsTableSortSchema,
  ClassifiedsTableSortType,
  validateSortOrder,
} from "@/app/schemas/table-sort-schema";
import { AdminTableFooter } from "@/components/shared/admin-table-footer";
import { ClassifiedsTableRow } from "@/components/admin/classifieds/classified-table-row";
import { AdminClassifiedsHeader } from "@/components/admin/classifieds/classifieds-header";
import { ClassifiedsTableHeader } from "@/components/admin/classifieds/classifieds-table-header";
import { Table, TableBody } from "@/components/ui/table";
import { routes } from "@/config/routes";
import { ClassifiedKeys, PageProps } from "@/config/types";
import db from "@/lib/db";

export default async function ClassifiedsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { page, itemsPerPage } = validatePagination({
    page: (searchParams?.page as string) || "1",
    itemsPerPage:
      (searchParams?.itemsPerPage as "10" | "25" | "50" | "100") || "10",
  });

  const { sort, order } = validateSortOrder<ClassifiedsTableSortType>({
    sort: searchParams?.sort as ClassifiedKeys,
    order: (searchParams?.order as "asc" | "desc") || "asc",
    schema: ClassifiedsTableSortSchema,
  });

  const offset = (Number(page) - 1) * Number(itemsPerPage);

  const { data, error } = AdminClassifiedFilterSchema.safeParse(searchParams);

  if (error) console.log("Validation error: ", error);

  const classifieds = await db.classified.findMany({
    where: {
      ...(data?.q && { title: { contains: data.q, mode: "insensitive" } }),
      ...(data?.status && data.status !== "ALL" && { status: data.status }),
    },
    orderBy: { [sort as string]: order as "asc" | "desc" },
    skip: offset,
    include: { images: { take: 1 } },
    take: Number(itemsPerPage),
  });

  const count = await db.classified.count({
    where: {
      ...(data?.q && { title: { contains: data.q, mode: "insensitive" } }),
      ...(data?.status && data.status !== "ALL" && { status: data.status }),
    },
  });

  const totalPages = Math.ceil(count / Number(itemsPerPage));

  return (
    <>
      <AdminClassifiedsHeader searchParams={searchParams} />
      <Table>
        <ClassifiedsTableHeader
          sort={sort as ClassifiedKeys}
          order={order as "asc" | "desc"}
        />
        <TableBody>
          {classifieds.map((classified) => (
            <ClassifiedsTableRow key={classified.id} {...classified} />
          ))}
        </TableBody>
        <AdminTableFooter
          baseURL={routes.admin.classifieds}
          searchParams={searchParams}
          disabled={!classifieds.length}
          totalPages={totalPages}
          cols={10}
        />
      </Table>
    </>
  );
}
