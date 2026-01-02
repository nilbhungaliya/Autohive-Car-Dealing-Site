"use server";

import { createAI, createStreamableValue } from "@ai-sdk/rsc";
import { ReactNode } from "react";

export async function testAction(): Promise<{ message: string }> {
  console.log("Test action called");
  return { message: "Test successful" };
}

type TestMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export const TestAI = createAI<TestMessage[], { message: string }[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    testAction,
  },
});