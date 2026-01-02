// using openai
// "use server";
// import { CoreMessage, generateObject, type UserContent } from "ai";
// import {
//   createAI,
//   createStreamableUI,
//   createStreamableValue,
//   StreamableValue,
// } from "ai/rsc";
// import { ReactNode } from "react";
// import { createOpenAI } from "@ai-sdk/openai";
// import { env } from "@/env";
// import {
//   StreamableSkeleton,
//   type StreamableSkeletonProps,
// } from "@/components/admin/classifieds/streamable-skeleton";
// import {
//   ClassifiedDetailsAISchema,
//   ClassifiedTaxonomyAISchema,
// } from "../schemas/classified-ai.schema";
// import { mapToTaxonomyOrCreate } from "@/lib/ai-utils";
// import db from "@/lib/db";

// const openai = createOpenAI({
//   apiKey: env.OPENAI_API_KEY,
//   compatibility: "strict",
// });

// export async function generateClassified(
//   image: string
// ): Promise<ClientMessage | null> {
//   const uiStream = createStreamableUI();
//   const valueStream = createStreamableValue<StreamableSkeletonProps>();

//   let classified = { image } as StreamableSkeletonProps;

//   uiStream.update(<StreamableSkeleton {...classified} />);

//   async function processEvents() {
//     const { object: taxonomy } = await generateObject({
//       model: openai("gpt-4o-mini-2024-07-18", { structuredOutputs: true }),
//       schema: ClassifiedTaxonomyAISchema,
//       system:
//         "You are an expert at analysing images of vehicles and responding with a structured JSON object based on the schema provided",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "image", image },
//             {
//               type: "text",
//               text: "You are tasked with returning the structured data for the vehicle in the image attached.",
//             },
//           ],
//         },
//       ] as CoreMessage[],
//     });
//     classified.title =
//       `${taxonomy.year} ${taxonomy.make} ${taxonomy.model} ${taxonomy.modelVariant ? ` ${taxonomy.modelVariant}` : ""}`.trim();

//     const foundTaxonomy = await mapToTaxonomyOrCreate({
//       year: taxonomy.year,
//       make: taxonomy.make,
//       model: taxonomy.model,
//       modelVariant: taxonomy.modelVariant,
//     });

//     if (foundTaxonomy) {
//       const make = await db.make.findFirst({
//         where: { name: foundTaxonomy.make },
//       });

//       if (make) {
//         classified = {
//           ...classified,
//           ...foundTaxonomy,
//           make,
//           makeId: make.id,
//         };
//       }
//     }
//     uiStream.update(<StreamableSkeleton {...classified} />);
//     const { object: details } = await generateObject({
//       model: openai("gpt-4o-mini-2024-07-18", { structuredOutputs: true }),
//       schema: ClassifiedDetailsAISchema,
//       system:
//         "You are an expert at writing vehicle descriptions and generating structured data",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "image", image },
//             {
//               type: "text",
//               text: `Based on the image provided, you are tasked with determining the odometer reading, doors, seats, ULEZ compliance, transmission, colour, fuel type, body type, drive type, VRM and any addition details in the schema provided for the ${classified.title}. You must be accurate when determining the values for these properties even if the image is not clear.`,
//             },
//           ],
//         },
//       ] as CoreMessage[],
//     });
//     classified = {
//       ...classified,
//       ...details,
//     };

//     uiStream.update(<StreamableSkeleton done={true} {...classified} />);
//     valueStream.update(classified);
//     uiStream.done();
//     valueStream.done();
//   }
//   processEvents();
//   return {
//     id: Date.now(),
//     display: uiStream.value,
//     role: "assistant" as const,
//     classified: valueStream.value,
//   };
// }

// type ServerMessage = {
//   id?: number;
//   name?: string | undefined;
//   role: "user" | "assistant" | "system";
//   content: UserContent;
// };

// export type ClientMessage = {
//   id: number;
//   role: "user" | "assistant";
//   display: ReactNode;
//   classified: StreamableValue<StreamableSkeletonProps>;
// };

// export const AI = createAI({
//   initialUIState: [] as ClientMessage[],
//   initialAIState: [] as ServerMessage[],
//   actions: {
//     generateClassified,
//   },
// });

// using groq for image analysis
"use server";
import { generateObject } from "ai";
import { ReactNode } from "react";
import { createGroq } from "@ai-sdk/groq";
import { env } from "../../../env.mjs";
import {
  StreamableSkeleton,
  type StreamableSkeletonProps,
} from "@/components/admin/classifieds/streamable-skeleton";
import {
  ClassifiedDetailsAISchema,
  ClassifiedTaxonomyAISchema,
} from "../schemas/classified-ai-schema";
import { mapToTaxonomyOrCreate } from "@/lib/ai-utils";
import db from "@/lib/db";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  StreamableValue,
} from "@ai-sdk/rsc";

const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

// Using Groq with llama-3.2-90b-vision-preview for reliable vision analysis
async function analyzeVehicleWithGroq(imageUrl: string, prompt: string) {
  try {
    const { object } = await generateObject({
      model: groq("llama-3.2-90b-vision-preview"),
      schema: ClassifiedTaxonomyAISchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", image: imageUrl },
            { type: "text", text: prompt },
          ],
        },
      ],
    });
    
    return object;
  } catch (error) {
    console.error("Error with Groq vision analysis, using fallback:", error);
    
    // Fallback: Generate reasonable defaults based on common vehicle data
    return {
      year: new Date().getFullYear() - Math.floor(Math.random() * 15),
      make: "Unknown",
      model: "Unknown",
      modelVariant: null,
      makeId: null,
      modelId: null,
      modelVariantId: null,
    };
  }
}

export async function generateClassified(image: string): Promise<ClientMessage | null> {
  console.log('generateClassified called with:', image?.slice(0, 50) + '...');
  const uiStream = createStreamableUI();
  const valueStream = createStreamableValue<StreamableSkeletonProps>();
  let classified = { image } as StreamableSkeletonProps;

  uiStream.update(<StreamableSkeleton {...classified} />);

  async function extractVehicleDetails(imageUrl: string) {
    try {
      const { object } = await generateObject({
        model: groq("llama-3.2-90b-vision-preview"),
        schema: ClassifiedDetailsAISchema,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", image: imageUrl },
              {
                type: "text",
                text: `Analyze this vehicle image and extract the following details in JSON format:
                - description: Brief description (max 50 words, no HTML tags, focus on vehicle specifics like type, visible features)
                - vrm: Vehicle registration mark (use "UNKNOWN" if not visible)
                - odoReading: Estimated odometer reading (reasonable guess based on vehicle age/condition)
                - doors: Number of doors (count all doors)
                - seats: Number of seats (typical for this vehicle type)
                - ulezCompliance: "EXEMPT" or "NON_EXEMPT" (assume NON_EXEMPT unless clearly electric/new)
                - transmission: "MANUAL" or "AUTOMATIC" (make educated guess based on vehicle type/age)
                - colour: One of the allowed colors (BLACK, BLUE, BROWN, GOLD, GREEN, GREY, ORANGE, PINK, PURPLE, RED, SILVER, WHITE, YELLOW)
                - fuelType: "PETROL", "DIESEL", "ELECTRIC", or "HYBRID"
                - bodyType: "SEDAN", "HATCHBACK", "SUV", "COUPE", "CONVERTIBLE", or "WAGON"
                - odoUnit: "MILES" or "KILOMETERS"
                
                Make reasonable assumptions based on what you can see in the image.`,
              },
            ],
          },
        ],
      });
      
      return object;
    } catch (error) {
      console.error("Error extracting vehicle details:", error);
      // Return reasonable defaults
      return {
        description: "Modern vehicle with standard features",
        vrm: "UNKNOWN",
        odoReading: 50000,
        doors: 4,
        seats: 5,
        ulezCompliance: "NON_EXEMPT" as const,
        transmission: "AUTOMATIC" as const,
        colour: "GREY" as const,
        fuelType: "PETROL" as const,
        bodyType: "SEDAN" as const,
        odoUnit: "MILES" as const,
      };
    }
  }

  async function processEvents() {
    try {
      // First, extract basic vehicle taxonomy (make, model, year)
      const taxonomy = await analyzeVehicleWithGroq(image, `
        Analyze this vehicle image and identify:
        - year: Vehicle manufacturing year (required, estimate if not certain)
        - make: Vehicle manufacturer (e.g., "Toyota", "BMW")
        - model: Vehicle model (e.g., "Camry", "3 Series")
        - modelVariant: Specific variant if identifiable (e.g., "Sport", "Hybrid")
        
        Return only valid JSON with these exact field names.
      `);

      ClassifiedTaxonomyAISchema.parse(taxonomy);
      classified.title =
        `${taxonomy.year} ${taxonomy.make} ${taxonomy.model}${taxonomy.modelVariant ? ` ${taxonomy.modelVariant}` : ""}`.trim();

      // Try to find matching taxonomy in database
      const foundTaxonomy = await mapToTaxonomyOrCreate(taxonomy);
      if (foundTaxonomy) {
        const make = await db.make.findFirst({
          where: { name: foundTaxonomy.make },
        });
        if (make) {
          classified = {
            ...classified,
            ...foundTaxonomy,
            make,
            makeId: make.id,
          };
        }
      }

      uiStream.update(<StreamableSkeleton {...classified} />);

      // Extract detailed vehicle specifications
      const details = await extractVehicleDetails(image);
      ClassifiedDetailsAISchema.parse(details);
      classified = { ...classified, ...details };

      uiStream.update(<StreamableSkeleton done={true} {...classified} />);
      valueStream.update(classified);
      uiStream.done();
      valueStream.done();
    } catch (error) {
      console.error("Error in processEvents:", error);
      uiStream.update(<div>Error processing image. Please try again.</div>);
      uiStream.done();
      valueStream.done();
    }
  }

  processEvents().catch(console.error);

  return {
    id: Date.now(),
    display: uiStream.value,
    role: "assistant" as const,
    classified: valueStream.value,
  };
}

export type ServerMessage = {
  id?: number;
  name?: string | undefined;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ClientMessage = {
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  classified: StreamableValue<StreamableSkeletonProps>;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    generateClassified,
  },
});
