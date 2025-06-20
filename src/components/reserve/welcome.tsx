"use client";
import {
  type MultiStepFormComponentProps,
  MultiStepFormEnum,
} from "@/config/types";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CreditCardIcon,
  Loader2,
  LockIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HtmlParser } from "../shared/html-parser";
import { Button } from "../ui/button";

export const Welcome = (props: MultiStepFormComponentProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const nextStep = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
      router.push(url.toString());
    });
  };

  return (
    <div className="mx-auto bg-background rounded-b-lg shadow-lg text-foreground">
      <div className="p-6">
        <div className="flex gap-x-12 justify-between">
          <div className="flex-1">
            <div className="flex items-start mb-4">
              <CircleCheckIcon className="text-primary w-6 h-6 mr-2" />
              <p className="text-muted-foreground">
                Reserve in minutes with 2 simple steps
              </p>
            </div>
            <div className="flex items-start mb-4">
              <CircleCheckIcon className="text-primary w-6 h-6 mr-2" />
              <p className="text-muted-foreground">
                Arrange a handover date for your new vehicle
              </p>
            </div>
          </div>
          <div className="flex flex-1 space-x-2">
            <div className="relative w-16 h-16">
              <Image
                src={props.classified.make.image}
                alt={props.classified.make.name}
                className="aspect-1/1 object-contain"
                height={100}
                width={100}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold line-clamp-1">
                {props.classified.title}
              </h2>
              <div className="text-xs line-clamp-2">
                <HtmlParser html={props.classified.description ?? ""} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="font-bold">Select Handover Date & Time</p>
          <p className="text-muted-foreground">approx. 1 minute</p>
        </div>
        <ArrowRightIcon className="w-6 h-6" />
        <div className="text-center">
          <p className="font-bold">Submit Your Details</p>
          <p className="text-muted-foreground">approx. 1 minute</p>
        </div>
        <p className="font-bold mb-4">Ready to begin?</p>
        <div className="flex justify-around items-center">
          <div className="flex items-center flex-col justify-center space-y-2">
            <LockIcon className="w-6 h-6" />
            <p className="text-muted-foreground">SSL Secure</p>
          </div>
          <div className="flex items-center flex-col justify-center space-y-2">
            <StarIcon className="w-6 h-6" />
            <p className="text-muted-foreground">Trustpilot</p>
          </div>
          <div className="flex items-center flex-col justify-center space-y-2">
            <CreditCardIcon className="w-6 h-6" />
            <p className="text-muted-foreground">Stripe</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Button
          type="button"
          onClick={nextStep}
          disabled={isPending}
          className="uppercase font-bold flex gap-x-3 w-full"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : null} {" "}
          I'm Ready
        </Button>
      </div>
    </div>
  );
};
