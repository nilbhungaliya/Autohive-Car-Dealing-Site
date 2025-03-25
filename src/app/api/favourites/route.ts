import { routes } from "@/config/routes";
import { favourites } from "@/config/types";
import { redis } from "@/lib/redis-store";
import { setSourceId } from "@/lib/source-id";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validateIdSchema = z.object({ id: z.number().int() });

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { data, error } = validateIdSchema.safeParse(body);

  if (!data) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }

  if (typeof data.id !== "number") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  //   get the source id from the cookie
  const sourceId = await setSourceId();

  //   get the favourites from the redis store
  const storedFavourites = await redis.get<favourites>(sourceId);

  const favourites: favourites = storedFavourites || { ids: [] };

  if (favourites.ids.includes(data.id)) {
    //   remove the id from the favourites
    favourites.ids = favourites.ids.filter((id) => id !== data.id);
  } else {
    //   add the id to the favourites
    favourites.ids.push(data.id);
  }

  //   update the favourites in the redis store
  await redis.set(sourceId, favourites);

  revalidatePath(routes.favourites);

  return NextResponse.json({ ids: favourites.ids }, { status: 200 });
};
