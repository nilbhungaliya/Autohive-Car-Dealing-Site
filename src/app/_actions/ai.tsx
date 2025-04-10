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

// using gemini
"use server";
import { CoreMessage } from "ai";
import { ReactNode } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import {
  StreamableSkeleton,
  type StreamableSkeletonProps,
} from "@/components/admin/classifieds/streamable-skeleton";
import {
  ClassifiedDetailsAISchema,
  ClassifiedTaxonomyAISchema,
} from "../schemas/classified-ai.schema";
import { mapToTaxonomyOrCreate } from "@/lib/ai-utils";
import db from "@/lib/db";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  StreamableValue,
} from "ai/rsc";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

async function getBase64Image(
  input: string
): Promise<{ mimeType: string; base64: string }> {
  if (input.startsWith("data:image/")) {
    const match = input.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid base64 image format.");
    return { mimeType: match[1], base64: match[2] };
  } else {
    const res = await fetch(input);
    const buffer = await res.arrayBuffer();
    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return { mimeType, base64 };
  }
}

export async function generateClassified(image: string) {
  const uiStream = createStreamableUI();
  const valueStream = createStreamableValue<StreamableSkeletonProps>();
  let classified = { image } as StreamableSkeletonProps;

  uiStream.update(<StreamableSkeleton {...classified} />);

  async function extractFromImage(prompt: string) {
    const { mimeType, base64 } = await getBase64Image(image);
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }],
        },
      ],
    });

    const raw = result.response.text();

    try {
      const match =
        raw.match(/```json([\s\S]*?)```/) || raw.match(/({[\s\S]*})/);
      if (!match) throw new Error("No JSON found in response");
      const json = JSON.parse(match[1].trim());
      return json;
    } catch (err) {
      console.error("Gemini raw output:", raw);
      throw new Error("Failed to parse AI response");
    }
  }

  async function processEvents() {
    const taxonomy = await extractFromImage(`
      You are an expert in analyzing vehicle images.
      
      Return a **valid JSON object** with the following fields and data types:
      {
        "year": number,               // Example: 2022
        "make": string,               // Example: "Rolls-Royce"
        "model": string,              // Example: "Ghost"
        "modelVariant": string | null, // Example: "Black Badge" or null
        "makeId": number,             // Unique numeric ID if available, otherwise null
        "modelId": number,            // Unique numeric ID if available, otherwise null
        "modelVariantId": number      // Unique numeric ID if available, otherwise null
      }
      
      **Only return the raw JSON.** Do not explain or add text.
      `);

    ClassifiedTaxonomyAISchema.parse(taxonomy);
    classified.title =
      `${taxonomy.year} ${taxonomy.make} ${taxonomy.model}${taxonomy.modelVariant ? ` ${taxonomy.modelVariant}` : ""}`.trim();

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

    const details = await extractFromImage(`
      You are an expert vehicle inspector.
      
      You are an expert vehicle classifier. Based on the given image and context, extract and return vehicle details in the following strict JSON format:

{
  "description": string,               // Max 50 words. No HTML tags.
  "vrm": string,                       // Registration mark. Use "UNKNOWN" if missing.
  "odoReading": number,               // Odometer reading.
  "doors": number,                    // Number of doors.
  "seats": number,                    // Number of seats.
  "ulezCompliance": "EXEMPT" | "NON_EXEMPT",    // ULEZ status.
  "transmission": "MANUAL" | "AUTOMATIC",       // Vehicle transmission.
  "colour": "BLACK" | "BLUE" | "BROWN" | "GOLD" | "GREEN" | "GREY" | "ORANGE" | "PINK" | "PURPLE" | "RED" | "SILVER" | "WHITE" | "YELLOW", // Use exact casing.
  "fuelType": "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID",  // Fuel type.
  "bodyType": "SEDAN" | "HATCHBACK" | "SUV" | "COUPE" | "CONVERTIBLE" | "WAGON",  // Body type.
  "odoUnit": "MILES" | "KILOMETERS"    // Unit of odometer reading.
}

Return **only** the JSON object, no extra commentary or explanation. Make sure enum values use uppercase (e.g. "AUTOMATIC", not "automatic"). Ensure all fields are present and strictly match the expected types.

      `);

    ClassifiedDetailsAISchema.parse(details);
    classified = { ...classified, ...details };

    uiStream.update(<StreamableSkeleton done={true} {...classified} />);
    valueStream.update(classified);
    uiStream.done();
    valueStream.done();
  }

  processEvents();

  return {
    id: Date.now(),
    display: uiStream.value,
    role: "assistant" as const,
    classified: valueStream.value,
  };
}

type ServerMessage = {
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

export const AI = createAI({
  initialUIState: [] as ClientMessage[],
  initialAIState: [] as ServerMessage[],
  actions: {
    generateClassified,
  },
});
