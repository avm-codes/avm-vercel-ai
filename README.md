# @avm-ai/avm-vercel-ai

A TypeScript-compliant npm package for running Python scripts using the AVM API, designed to be integrated into the Vercel AI SDK as a tool.

## Description

This package provides a tool to execute Python scripts using the AVM API. It is designed to be used in environments where you need to run Python code and integrate it with your JavaScript/TypeScript applications, specifically as a tool within the Vercel AI SDK.

## Installation

You can install the package using npm:

```bash
npm install @avm-ai/avm-vercel-ai
```

## Usage

To use the package, you need to set the `AVM_API_KEY` environment variable. You can do this by creating a `.env` file in your project root with the following content:

```
AVM_API_KEY=your-api-key-here
```

Here's an example of how to use the package:

```javascript
import { runPythonTool } from "@avm-ai/avm-vercel-ai";
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
```

## Features

- Execute Python scripts using the AVM API.
- TypeScript support for better development experience.
- Easy integration with existing JavaScript/TypeScript projects.
- Designed to be integrated into the Vercel AI SDK as a tool.

## License

MIT
