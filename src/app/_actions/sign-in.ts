"use server";
import { signIn } from "@/auth";
import { SignInSchema } from "../schemas/auth-schema";
import { routes } from "@/config/routes";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { PrevState } from "@/config/types";
import { AuthError } from "next-auth";

export const signInAction = async (_: PrevState, formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, success, error } = SignInSchema.safeParse({
      email,
      password,
    });

    if (!success) {
      console.log({ error });
      return { success: false, message: "Invalid Credentials" };
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      redirectTo: routes.challenge,
    });

    if (result?.error) {
      return { success: false, message: "Invalid Credentials" };
    }

    return {
      success: true,
      message: "Signed in successfully!",
      redirectTo: routes.challenge,
    };

  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, message: "Invalid Credentials" };
      }

      return { success: false, message: "Unable to sign in. Try again." };
    }

    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
};
