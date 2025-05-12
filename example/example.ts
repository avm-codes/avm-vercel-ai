import { runPythonTool } from "../base/index.js";
import dotenv from "dotenv";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

dotenv.config();

(async () => {
  const apiKey = process.env.AVM_API_KEY;
  if (!apiKey) {
    console.error("AVM_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const tool = runPythonTool();

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      "Create a random noise signal of 50 datapoints, output the signal in a nice markdown table",
    tools: {
      runPython: tool,
    },
    maxSteps: 10,
  });

  console.log(text);
})();
