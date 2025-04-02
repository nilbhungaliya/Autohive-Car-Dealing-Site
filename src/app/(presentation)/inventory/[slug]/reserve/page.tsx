import { MultiStepFormSchema } from "@/app/schemas/MultiStepform.schema";
import { SelectDate } from "@/components/reserve/select-date";
import { SubmitDetails } from "@/components/reserve/submit-details";
import { Welcome } from "@/components/reserve/welcome";
import { MultiStepFormEnum, type PageProps } from "@/config/types";
import db from "@/lib/db";
import { notFound } from "next/navigation";

const MAP_STEP_TO_COMPONENT = {
	[MultiStepFormEnum.WELCOME]: Welcome,
	[MultiStepFormEnum.SELECT_DATE]: SelectDate,
	[MultiStepFormEnum.SUBMIT_DETAILS]: SubmitDetails,
};

export default async function ReservePage(prop:PageProps) {
    const searchParams = await prop.searchParams;
    const params = await prop.params;
    const slug = params?.slug;
    const step = searchParams?.step;

    const {data, success, error} = MultiStepFormSchema.safeParse({
        slug,
        step: Number(step),
    })

    if (!success) {
		console.log({ error });
		notFound();
	}

    const classified = await db.classified.findUnique({
        where:{slug: data.slug},
        include:{make:true}
    })

    if(!classified){
        notFound()
    }

    const Component = MAP_STEP_TO_COMPONENT[data.step];
    // console.log(Component);

    return (
		<Component
			searchParams={searchParams}
			params={params}
			classified={classified}
		/>
	);
}
