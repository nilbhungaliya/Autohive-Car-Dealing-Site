"use client";
import { updateClassifiedAction } from "@/app/_actions/classified";
import {
  updateClassifiedSchema,
  UpdateClassifiedType,
} from "@/app/schemas/classified.schema";
import type { ClassifiedWithImages } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassifiedStatus, CurrencyCode, OdoUnit } from "@prisma/client";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { MAX_IMAGES } from "@/config/constants";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { formatClassifiedStatus } from "@/lib/utils";
import { ClassifiedFormFields } from "./classified-form-fieds";
import { SelectAdmin } from "@/components/ui/selectAdmin";

interface ClassifiedFormProps {
  classified: ClassifiedWithImages;
}

function extractKey(url: string) {
  const nextUrl = new URL(url);
  nextUrl.href = url;

  const regex = /uploads\/.+/;
  const match = url.match(regex);

  return match ? match[0] : url;
}

export const ClassifiedForm = ({ classified }: ClassifiedFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateClassifiedType>({
    resolver: zodResolver(updateClassifiedSchema),
    defaultValues: {
      id: classified.id,
      odoUnit: OdoUnit.MILES,
      currency: CurrencyCode.GBP,
      ...(classified && {
        images: classified.images
          ? classified.images.map((image, index) => ({
              ...image,
              id: index + 1,
              percentage: 100,
              key: extractKey(image.src),
              done: true,
            }))
          : [],
        make: classified.makeId.toString(),
        model: classified.modelId.toString(),
        modelVariant: classified.modelVariantId?.toString(),
        year: classified.year.toString(),
        vrm: classified.vrm ?? "",
        description: classified.description ?? "",
        fuelType: classified.fuelType,
        bodyType: classified.bodyType,
        transmission: classified.transmission,
        colour: classified.colour,
        ulezCompliance: classified.ulezCompliance,
        status: classified.status,
        odoReading: classified.odoReading,
        seats: classified.seats,
        doors: classified.doors,
        price: classified.price / 100,
      }),
    },
  });

  const classifiedFormSubmit: SubmitHandler<UpdateClassifiedType> = (data) => {
    startTransition(async () => {
      const { success, message } = await updateClassifiedAction(data);

      if (!success) {
        toast.error(message, {
          duration: 2500,
          description: message,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(classifiedFormSubmit)}>
        <h1 className="text-3xl font-bold mb-6 text-muted">Upload Vehicle</h1>
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClassifiedFormFields />
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field: { name, onChange } }) => (
                <FormItem>
                  <FormLabel className="text-muted" htmlFor="images">
                    Images (up to {MAX_IMAGES})
                  </FormLabel>
                  <FormControl>
                    {/* <MultiImageUploader name={name} onChange={onChange} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field: { ref, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-muted" htmlFor="status">
                    Status
                  </FormLabel>
                  <FormControl>
                    <SelectAdmin
                      options={Object.values(ClassifiedStatus).map((value) => ({
                        label: formatClassifiedStatus(value),
                        value,
                        className:"bg-primary-800 text-white"
                      }))}
                      noDefault={false}
                      selectClassName="bg-primary-800 border-transparent text-muted/75 text-white"
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full flex gap-x-2"
            >
              {isPending && <Loader2 className="animate-spin h-4 w-4" />}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
