"use client";
import { createClassifiedFormAction } from "@/app/_actions/classified";
import {
  createClassifiedSchema,
  CreateClassifiedType,
} from "@/app/schemas/classified-schema";
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
import { MultiImageUploader } from "./multiImage-uploader";

export const CreateClassifiedForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateClassifiedType>({
    resolver: zodResolver(createClassifiedSchema),
    defaultValues: {
      odoUnit: OdoUnit.MILES,
      currency: CurrencyCode.GBP,
      images: [],
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      vrm: "",
      description: "",
      fuelType: "PETROL",
      bodyType: "SEDAN",
      transmission: "MANUAL",
      colour: "WHITE",
      ulezCompliance: "NON_EXEMPT",
      status: ClassifiedStatus.DRAFT,
      odoReading: 0,
      seats: 5,
      doors: 4,
      price: 0,
    },
  });

  const classifiedFormSubmit: SubmitHandler<CreateClassifiedType> = (data) => {
    startTransition(async () => {
      const { success, message } = await createClassifiedFormAction(data);

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
        <h1 className="text-3xl font-bold mb-6 text-foreground">Create Vehicle</h1>
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClassifiedFormFields />
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field: { name, onChange } }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground" htmlFor="images">
                    Images (up to {MAX_IMAGES})
                  </FormLabel>
                  <FormControl>
                    <MultiImageUploader name={name} onChange={onChange} />
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
                  <FormLabel className="text-muted-foreground" htmlFor="status">
                    Status
                  </FormLabel>
                  <FormControl>
                    <SelectAdmin
                      options={Object.values(ClassifiedStatus).map((value) => ({
                        label: formatClassifiedStatus(value),
                        value,
                        className:"bg-primary text-foreground"
                      }))}
                      noDefault={false}
                      selectClassName="bg-primary border-transparent text-primary-foreground"
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
              Create
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

