"use client";
import type { AI } from "@/app/_actions/ai";
import { SingleImageSchema, SingleImageType } from "@/app/schemas/image.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StreamableSkeletonProps } from "./streamable-skeleton";
import {
  ClassifiedAISchema,
  ClassifiedAI,
} from "@/app/schemas/classified-ai.schema";
import { z } from "zod";
import { toast } from "sonner";
import { createClassifiedAction } from "@/app/_actions/classified";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "./single-image-uploader";

export const CreateClassifiedDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();
  const { generateClassified } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  const imageForm = useForm<SingleImageType>({
    resolver: zodResolver(SingleImageSchema),
  });

  const createForm = useForm<StreamableSkeletonProps>({
    // @ts-ignore
    resolver: zodResolver(
      ClassifiedAISchema.extend({
        make: z.object({
          id: z.number().int(),
          name: z.string(),
          image: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      })
    ),
  });

  const handleImageUpload = (url: string) => {
    imageForm.setValue("image", url);
  };

  const onImageSubmit: SubmitHandler<SingleImageType> = (data) => {
    startUploadTransition(async () => {
      const responseMessage = await generateClassified(data.image);
      if (!responseMessage) return;
      setMessages((currentMessages) => [...currentMessages, responseMessage]);
      for await (const value of readStreamableValue(
        responseMessage.classified
      )) {
        if (value) createForm.reset(value);
      }
    });
  };

  const onCreateSubmit: SubmitHandler<StreamableSkeletonProps> = (data) => {
    startCreateTransition(async () => {
      setMessages([]);
      const { success, message } = await createClassifiedAction(data);

      if (!success) {
        toast.error(message, {
          description: "Error",
          duration: 2500,
        });

        return;
      }
    });
  };  

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				<Button className="ml-4" size="sm">
					Create New
				</Button>
			</DialogTrigger>
			<DialogContent className={cn("max-w-6xl bg-white")}>
				<DialogHeader>
					<DialogTitle className="text-black">Create New Classified</DialogTitle>
				</DialogHeader>
				{messages.length ? (
					<Form {...createForm}>
						<form
							className="space-y-4 text-black"
							onSubmit={createForm.handleSubmit(onCreateSubmit)}
						>
							{messages.map((message) => (
								<div className="w-full" key={message.id}>
									{message.display}
								</div>
							))}
							<div className="flex justify-between gap-2">
								<Button
									variant="outline"
									type="button"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									disabled={isCreating || isUploading}
									type="submit"
									className="flex items-center gap-x-2"
								>
									{isCreating || isUploading ? (
										<Loader2 className="animate-spin h-4 w-4" />
									) : null}
									{isUploading ? "Uploading..." : "Create"}
								</Button>
							</div>
						</form>
					</Form>
				) : (
					<Form {...imageForm}>
						<form
							className="space-y-4 text-black"
							onSubmit={imageForm.handleSubmit(onImageSubmit)}
						>
							<ImageUploader onUploadComplete={handleImageUpload} />
							<div className="flex justify-between gap-2">
								<Button
									variant="outline"
									type="button"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									disabled={isUploading}
									type="submit"
									className="flex items-center gap-x-2"
								>
									{isUploading && <Loader2 className="animate-spin h-4 w-4" />}
									Upload
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
  );
};
