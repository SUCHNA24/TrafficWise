'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a 12-hour congestion forecast.
 *
 * - congestionForecast - A function that triggers the congestion forecast flow.
 * - CongestionForecastInput - The input type for the congestionForecast function (currently empty).
 * - CongestionForecastOutput - The return type for the congestionForecast function, containing the forecast data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CongestionForecastInputSchema = z.object({});
export type CongestionForecastInput = z.infer<typeof CongestionForecastInputSchema>;

const CongestionForecastOutputSchema = z.object({
  forecastData: z.array(z.object({
    timestamp: z.string().describe('The timestamp of the forecast data point.'),
    congestionLevel: z.number().describe('The predicted congestion level (0-100).'),
  })).describe('An array of congestion level predictions for the next 12 hours.'),
});
export type CongestionForecastOutput = z.infer<typeof CongestionForecastOutputSchema>;

export async function congestionForecast(input: CongestionForecastInput): Promise<CongestionForecastOutput> {
  return congestionForecastFlow(input);
}

import {getHistoricalTrafficData, getLSTMForecast} from '@/services/traffic-data';

const congestionForecastFlow = ai.defineFlow(
  {
    name: 'congestionForecastFlow',
    inputSchema: CongestionForecastInputSchema,
    outputSchema: CongestionForecastOutputSchema,
  },
  async input => {
    const historicalData = await getHistoricalTrafficData();
    const forecastData = await getLSTMForecast(historicalData);

    return {
      forecastData: forecastData,
    };
  }
);

