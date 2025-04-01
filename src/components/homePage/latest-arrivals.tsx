import { Favourites } from "@/config/types"
import db from "@/lib/db"
import { redis } from "@/lib/redis-store"
import { getSourceId } from "@/lib/source-id"
import { ClassifiedStatus } from "@prisma/client"
import { LatestArrivalsCarousel } from "./latest-arrival-carousel"

export const LatestArrivals = async () => {
    const classifieds = await db.classified.findMany({
        where:{status: ClassifiedStatus.LIVE},
        take: 6,
        include:{images:true},
    })

    const sourceId = await getSourceId();
    const favourites = await redis.get<Favourites>(sourceId || "" );

    return (
        <section className="py-16 sm:py-24">
			<div className="container mx-auto max-w-[80vw]">
				<h2 className="mt-2 uppercase text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Latest Arrivals
				</h2>
				<LatestArrivalsCarousel
					classifieds={classifieds}
					favourites={favourites ? favourites.ids : []}
				/>
			</div>
		</section>
    )
}