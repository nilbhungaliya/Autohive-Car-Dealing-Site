import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedClassifieds } from "./classifieds.seed";
import { seedImages } from "./images.seed";
import { seedAdmin } from "./admin.seed";

const prisma = new PrismaClient();

async function main() {
	// console.log("testing");
	// await seedTaxonomy(prisma);
	// await seedClassifieds(prisma);
	// await seedImages(prisma);
	await seedAdmin(prisma);
}

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
