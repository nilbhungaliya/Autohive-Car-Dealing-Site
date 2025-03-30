"use server";

import db from "@/lib/db";
import { CustomerStatus } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { SubscribeSchema } from "../schemas/subscribe.Schema";

export const subscribeAction = async (_: any, formData: FormData) => {
  try {
    const { data, success, error } = SubscribeSchema.safeParse({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    });

    if (!success) {
      return { success: false, message: "Fill all the fields" };
    }

    const subscriber = await db.customer.findFirst({
      where: {
        email: data.email,
      },
    });

    if(subscriber) {
        return {success: false, message: "You are already Subscribed!"};
    }

    await db.customer.create({
        data:{
            ...data,
            status: CustomerStatus.SUBSCRIBER
        }
    })

    return{success: true, message: "Subscribed successfully!"};
  } catch (error) {
    // if (error instanceof PrismaClientKnownRequestError) {
    //   return { success: false, message: error.message };
    // }
    // if (error instanceof PrismaClientValidationError) {
    //     return { success: false, message: error.message };
    // }
    // if (error instanceof Error) {
    //     return { success: false, message: error.message };
    // }
    return { success: false, message: "Something went wrong" };
  }
};
