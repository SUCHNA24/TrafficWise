
import { config } from 'dotenv';
config();

import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Attempt to import dotprompt and add it to plugins only if successful
let dotpromptPlugin = null;
try {
  const { dotprompt } = await import('@genkit-ai/dotprompt');
  dotpromptPlugin = dotprompt();
  console.log('@genkit-ai/dotprompt loaded successfully.');
} catch (e) {
  console.warn(
    `
#######################################################################################
WARNING: @genkit-ai/dotprompt module not found. 
This plugin is optional but recommended for defining prompts.
If you intend to use .prompt files, please install it:
  npm install @genkit-ai/dotprompt
  # or
  yarn add @genkit-ai/dotprompt
  # or
  pnpm add @genkit-ai/dotprompt
#######################################################################################
    `
  );
}

const genkitPlugins: Plugin<any>[] = [];

if (dotpromptPlugin) {
  genkitPlugins.push(dotpromptPlugin);
}

let defaultModel: string | undefined = undefined;

if (process.env.GOOGLE_API_KEY) {
  genkitPlugins.push(googleAI());
  defaultModel = 'googleai/gemini-1.5-flash-latest';
  console.log('GOOGLE_API_KEY found. Initializing Google AI plugin for Genkit.');
} else {
  console.warn(
    `
#######################################################################################
WARNING: GOOGLE_API_KEY environment variable is not set.
Genkit's Google AI features will be disabled.
Functionality requiring Large Language Models (e.g., AI-powered generation or analysis) 
will not work. Some features might use mock data or fail if they rely on these LLMs.

To enable full AI capabilities:
1. Ensure you have a valid Google AI API key.
2. Set the GOOGLE_API_KEY environment variable. For example, in your .env file:
   GOOGLE_API_KEY=YOUR_API_KEY_HERE

For more details, see https://firebase.google.com/docs/genkit/plugins/google-genai
#######################################################################################
    `
  );
  // If no API key, Genkit will operate without Google AI models.
  // Flows that do not require a model (like the current congestionForecast) may still work.
  // Flows that require a model will fail at runtime if no suitable plugin/model is found.
}

export const ai = genkit({
  plugins: genkitPlugins,
  // Only set a default Google AI model if the plugin is active and an API key is present.
  ...(defaultModel && { model: defaultModel }),
  // Note: logLevel 'debug' is configured differently in Genkit 1.x, typically via genkit-tools if needed.
  // enableTracingAndMetrics: true, // Uncomment if you need tracing
});

