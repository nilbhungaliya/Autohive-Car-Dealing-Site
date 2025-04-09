"use server";

import { auth } from "@/auth";
import { StreamableSkeletonProps } from "@/components/admin/classifieds/streamable-skeleton";
import { routes } from "@/config/routes";
import db from "@/lib/db";
import { generateThumbHashFromSrcUrl } from "@/lib/thumbhash-server";
import { CurrencyCode } from "@prisma/client";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createPngDataUri } from "unlazy/thumbhash";

export const createClassifiedAction = async (data: StreamableSkeletonProps) => {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  let success = false;
  let classifiedId: number | null = null;

  try {
    const make = await db.make.findUnique({
      where: { id: data.makeId as number },
    });

    const model = await db.model.findUnique({
      where: { id: data.modelId as number },
    });

    let title = `${data.year} ${make?.name} ${model?.name}`;

    if (data?.modelVariantId) {
      const modelVariant = await db.modelVariant.findUnique({
        where: { id: data.modelVariantId as number },
      });

      if (modelVariant) title = `${title} ${modelVariant.name}`;
    }

    let slug = slugify(`${title} ${data.vrm ?? randomInt(100000, 999999)}`);

    const slugLikeFound = await db.classified.count({
      where: { slug: { contains: slug, mode: "insensitive" } },
    });

    if (slugLikeFound) {
      slug = slugify(`${title} ${data.vrm} ${slugLikeFound + 1}`);
    }

    const thumbHash = await generateThumbHashFromSrcUrl(data.image as string);

    const uri = createPngDataUri(thumbHash);

    const classified = await db.classified.create({
      data: {
        slug,
        title,
        year: Number(data.year),
        makeId: data.makeId as number,
        modelId: data.modelId as number,
        ...(data.modelVariantId && {
          modelVariantId: data.modelVariantId as number,
        }),
        vrm: data?.vrm ? data.vrm : null,
        price: 0,
        currency: CurrencyCode.GBP,
        odoReading: data.odoReading,
        odoUnit: data.odoUnit,
        fuelType: data.fuelType,
        bodyType: data.bodyType,
        colour: data.colour,
        transmission: data.transmission,
        ulezCompliance: data.ulezCompliance,
        description: data.description,
        doors: data.doors,
        seats: data.seats,
        images: {
          create: {
            isMain: true,
            blurhash: uri,
            src: data.image as string,
            alt: title,
          },
        },
      },
    });

    if (classified) {
        classifiedId = classified.id;
        success = true;
    }
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }

  if (success && classifiedId) {
    revalidatePath(routes.admin.classifieds);
    redirect(routes.admin.editClassified(classifiedId));
  } else {
    return { success: false, message: "Failed to create classified" };
  }
};
