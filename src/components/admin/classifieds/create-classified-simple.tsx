"use client";
import { SingleImageSchema, SingleImageType } from "@/app/schemas/image-schema";
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
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createClassifiedAction } from "@/app/_actions/classified";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "./single-image-uploader";

// Import the proper type
import { StreamableSkeletonProps } from "./streamable-skeleton";

// Simple AI analysis function
async function analyzeImageSimple(imageUrl: string): Promise<StreamableSkeletonProps> {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Return default data if AI fails
    return {
      image: imageUrl,
      title: "Unknown Vehicle",
      year: new Date().getFullYear(),
      make: {
        id: 0,
        name: "Unknown",
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      model: "Unknown",
      description: "Vehicle details to be manually updated",
      vrm: "UNKNOWN",
      odoReading: 0,
      doors: 4,
      seats: 5,
      ulezCompliance: "NON_EXEMPT",
      transmission: "MANUAL",
      colour: "WHITE",
      fuelType: "PETROL",
      bodyType: "SEDAN",
      odoUnit: "MILES",
    };
  }
}

export const CreateClassifiedSimple = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, startAnalyzeTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();
  const [analyzedData, setAnalyzedData] = useState<StreamableSkeletonProps | null>(null);

  const imageForm = useForm<SingleImageType>({
    resolver: zodResolver(SingleImageSchema),
  });

  const handleImageUpload = (url: string) => {
    imageForm.setValue("image", url);
  };

  const onImageSubmit: SubmitHandler<SingleImageType> = (data) => {
    startAnalyzeTransition(async () => {
      try {
        const analyzed = await analyzeImageSimple(data.image);
        setAnalyzedData(analyzed);
        toast.success("Image analyzed successfully!", {
          description: "Review and edit the details below",
          duration: 2500,
        });
      } catch (error) {
        console.error("Failed to analyze image:", error);
        toast.error("Failed to analyze image", {
          description: "You can still create the classified manually",
          duration: 2500,
        });
        // Set basic data even if analysis fails
        setAnalyzedData({
          image: data.image,
          title: "New Vehicle",
          year: new Date().getFullYear(),
          make: {
            id: 0,
            name: "Unknown",
            image: data.image,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          model: "Unknown",
          description: "Vehicle details to be updated",
          vrm: "UNKNOWN",
          odoReading: 0,
          doors: 4,
          seats: 5,
          ulezCompliance: "NON_EXEMPT",
          transmission: "MANUAL",
          colour: "WHITE",
          fuelType: "PETROL",
          bodyType: "SEDAN",
          odoUnit: "MILES",
        });
      }
    });
  };

  const onCreateSubmit = () => {
    if (!analyzedData) return;
    
    startCreateTransition(async () => {
      try {
        const { success, message } = await createClassifiedAction(analyzedData);

        if (!success) {
          toast.error(message || "Failed to create classified", {
            description: "Error",
            duration: 2500,
          });
        } else {
          toast.success("Classified created successfully!", {
            duration: 2500,
          });
          setIsModalOpen(false);
          setAnalyzedData(null);
          imageForm.reset();
        }
      } catch (error) {
        toast.error("Failed to create classified", {
          description: "Please try again",
          duration: 2500,
        });
      }
    });
  };

  const resetForm = () => {
    setAnalyzedData(null);
    imageForm.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4" size="sm">
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-4xl bg-white text-black")}>
        <DialogHeader className="text-black">
          <DialogTitle>Create New Classified</DialogTitle>
        </DialogHeader>
        
        {analyzedData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img 
                  src={analyzedData.image} 
                  alt="Vehicle" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{analyzedData.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Year:</strong> {analyzedData.year}</div>
                  <div><strong>Make:</strong> {analyzedData.make?.name}</div>
                  <div><strong>Model:</strong> {analyzedData.model}</div>
                  <div><strong>Fuel:</strong> {analyzedData.fuelType}</div>
                  <div><strong>Transmission:</strong> {analyzedData.transmission}</div>
                  <div><strong>Body Type:</strong> {analyzedData.bodyType}</div>
                  <div><strong>Doors:</strong> {analyzedData.doors}</div>
                  <div><strong>Seats:</strong> {analyzedData.seats}</div>
                  <div><strong>Colour:</strong> {analyzedData.colour}</div>
                  <div><strong>VRM:</strong> {analyzedData.vrm}</div>
                </div>
                <div className="mt-2">
                  <strong>Description:</strong>
                  <p className="text-sm text-gray-600">{analyzedData.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                className="text-black"
                variant="outline"
                type="button"
                onClick={resetForm}
              >
                Back to Upload
              </Button>
              <div className="flex gap-2">
                <Button
                  className="text-black"
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isCreating}
                  onClick={onCreateSubmit}
                  className="flex items-center gap-x-2"
                >
                  {isCreating && <Loader2 className="animate-spin h-4 w-4" />}
                  Create Classified
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Form {...imageForm}>
            <form
              className="space-y-4"
              onSubmit={imageForm.handleSubmit(onImageSubmit)}
            >
              <ImageUploader onUploadComplete={handleImageUpload} />
              <div className="flex justify-between gap-2">
                <Button
                  className="text-black"
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isAnalyzing}
                  type="submit"
                  className="flex items-center gap-x-2"
                >
                  {isAnalyzing && (
                    <Loader2 className="animate-spin h-4 w-4" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Upload & Analyze"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};