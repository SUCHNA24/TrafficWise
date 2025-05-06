import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // Using a generally available model. Ensure your API key has access.
  model: 'googleai/gemini-1.5-flash-latest', 
});
