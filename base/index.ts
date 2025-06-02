import { tool } from "ai";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_MAX_TIMEOUT = 60 * 1000 * 10;
const DEFAULT_BASE_URL = "https://api.avm.codes";
const DEFAULT_API_KEY = process.env.AVM_API_KEY || "";

const runPython = (
  apiKey: string = DEFAULT_API_KEY,
  maxTimeout: number = DEFAULT_MAX_TIMEOUT,
  baseUrl: string = DEFAULT_BASE_URL
) =>
  tool({
    description: "Run a python script",
    parameters: z.object({
      code: z.string().describe(
        `
This tool runs a python self-contained, executable code snippet. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
`
      ),
    }),
    execute: async ({ code }) => {
      if (!apiKey || apiKey === "") {
        throw new Error("AVM_API_KEY is not set");
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Execution exceeded max timeout, try increasing the timeout"
            )
          );
        }, maxTimeout);
      });

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`${baseUrl}/api/run/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "avm-x-api-key": apiKey,
            },
            body: JSON.stringify({ code, language: "python" }),
          });

          if (response.ok) {
            const data = await response.json();
            resolve(data);
          } else {
            resolve({
              error: "Failed to execute python script",
              error_message: response.statusText,
              error_code: response.status,
              error_details: await response.text(),
            });
          }
        } catch (error) {
          reject({
            error: "Failed to execute python script",
            error_message: "Unknown error",
            error_code: 500,
            error_details: "Unknown error",
          });
        }
      });

      return await Promise.race([promise, timeoutPromise]);
    },
  });

export const runPythonTool = runPython;
