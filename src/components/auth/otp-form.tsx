"use client";

import {
  OneTimePasswordSchema,
  type OtpSchemaType,
} from "@/app/schemas/otp-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import { OneTimePasswordInput } from "./otp-input";
import {
  completeChallengeAction,
  resendChallengeAction,
} from "@/app/_actions/challenge";
import { toast } from "sonner";
import { routes } from "@/config/routes";

export const OtpForm = () => {
  const [isCodePending, startCodeTransition] = useTransition();
  const [isSubmitPending, startSubmitTransition] = useTransition();
  const router = useRouter();

  const form = useForm<OtpSchemaType>({
    resolver: zodResolver(OneTimePasswordSchema),
  });

  const onSubmit: SubmitHandler<OtpSchemaType> = (data) => {
    startSubmitTransition(async () => {
      const result = await completeChallengeAction(data.code);

      if (!result.success) {
        toast.error(result.message, {
          duration: 2500,
        });
      } else {
        router.push(routes.admin.dashboard);
      }
    });
  };

  const [sendButtonText, setSendButtonText] = useState("Resend code");

  const sendCode = () => {
    startCodeTransition(async () => {
      const { success, message } = await resendChallengeAction();
      setSendButtonText("Resend code");

      if (!success) {
        toast.error(message, {
          duration: 2500,
        });
        return;
      }
      toast.success("Check your email for the code", {
        duration: 1000,
      });
    });
  };

  useEffect(() => {
    if (isCodePending) setSendButtonText("Sending...");
  }, [isCodePending]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex w-full flex-1 justify-center px-6 pt-10 lg:items-center lg:pt-0 text-black">
      <div className="flex w-full max-w-lg flex-col">
        <h3 className="mb-4 text-4xl lg:text-5xl text-center">
          One Time Password
        </h3>
        <p className="mb-12 text-center text-slate-500">
          Enter the six digit code sent to your email
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <OneTimePasswordInput
                      type="number"
                      setValue={onChange}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                className="flex items-centewr gap-2.5 text-base font-medium text-slate-600 transition-colors duration-200 hover:text-primary group cursor-pointer"
                onClick={sendCode}
                disabled={isCodePending}
              >
                {isCodePending ? (
                  <Loader2 className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary animate-spin" />
                ) : (
                  <RotateCw className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary" />
                )}
                {sendButtonText}
              </button>
            </div>
            <div className="mt-6 flex w-full flex-col gap-4 md:mt-16">
              <Button
                className="flex w-full gap-x-2"
                disabled={isSubmitPending}
              >
                <span className="text-sm uppercase tracking-wider text-inherit">
                  {isSubmitPending ? "Verifying..." : "Verify"}
                </span>
                {isSubmitPending ? (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                ) : null}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
