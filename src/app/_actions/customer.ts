"use server";

import db from "@/lib/db";
import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "../schemas/customer.schema";

export const createCustomerAction = async (props: CreateCustomerSchemaType) => {
  try {
    const { data, success, error } = CreateCustomerSchema.safeParse(props);

    if (!success) {
      console.log({ error });
      return { success: false, message: "Invalid data" };
    }

    if (data.terms !== "true") {
      return { success: false, message: "You must accept the terms" };
    }

    const { date, slug, terms, ...rest } = data;

    await db.customer.create({
      data: {
        ...rest,
        bookingDate: date,
        termsAccepted: terms === "true",
        classified: { connect: { slug } },
      },
    });
    return { success: true, message: "Customer created successfully" };
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Something went wrong" };
  }
};
