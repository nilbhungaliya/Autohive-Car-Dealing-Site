import { bcryptPasswordHash } from "@/lib/bcrypt";
import type { PrismaClient } from "@prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
	const password = await bcryptPasswordHash("");

	const admin = await prisma.user.create({
		data: {
			email: "",
			hashedPassword: password,
		},
	});

	console.log("Admin created: ", admin);

	return admin;
}