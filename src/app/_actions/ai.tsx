"use server";
import { type UserContent } from "ai";
import { createAI, createStreamableUI, createStreamableValue, StreamableValue } from "ai/rsc";
import { ReactNode } from "react";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/env";
import { StreamableSkeleton, type StreamableSkeletonProps } from "@/components/admin/classifieds/streamable-skeleton";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  compatibility: "strict",
});

export async function generateClassified(
  image: string
): Promise<ClientMessage | null> {
  const uiStream = createStreamableUI();
  const valueStream = createStreamableValue<StreamableSkeletonProps>();

  let classified = {image}
  
  uiStream.update(<StreamableSkeleton {...classified} />);


  return null;
}

type ServerMessage = {
  id?: number;
  name?: string | undefined;
  role: "user" | "assistant" | "system";
  content: UserContent;
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
