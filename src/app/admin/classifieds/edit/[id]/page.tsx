import { validateIdSchema } from "@/app/schemas/id-schema";
import { ClassifiedForm } from "@/components/admin/classifieds/classified-form";
import { routes } from "@/config/routes";
import { PageProps } from "@/config/types";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function EditClassified(props:PageProps) {
    const params = await props.params;

    const { data, success } = validateIdSchema.safeParse({
		id: Number(params?.id),
	});

    if (!success) redirect(routes.admin.classifieds);
    const classified = await db.classified.findUnique({
        where:{id:data.id},
        include:{images:true}
    })
    if(!classified) redirect(routes.admin.classifieds);


    return <ClassifiedForm classified={classified} />
}
