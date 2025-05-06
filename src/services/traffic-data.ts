/**
 * @fileOverview This file provides services for fetching and processing traffic data.
 *
 * - getHistoricalTrafficData - Fetches historical traffic data.
 * - getLSTMForecast - Generates an LSTM forecast based on historical data.
 */

export interface TrafficDataPoint {
  timestamp: string; // ISO 8601 timestamp
  congestionLevel: number; // 0-100
}

/**
 * Simulates fetching historical traffic data.
 * In a real application, this would fetch data from a database or an external API.
 * @returns A promise that resolves to an array of historical traffic data points.
 */
export async function getHistoricalTrafficData(): Promise<TrafficDataPoint[]> {
  // Mock historical data for the last hour, every 5 minutes
  const now = new Date();
  const data: TrafficDataPoint[] = [];
  for (let i = 12; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      congestionLevel: Math.floor(Math.random() * 60) + 20, // Random congestion between 20 and 80
    });
  }
  return data;
}

/**
 * Simulates generating an LSTM forecast based on historical data.
 * In a real application, this would involve a machine learning model.
 * @param historicalData An array of historical traffic data points.
 * @returns A promise that resolves to an array of forecasted traffic data points for the next 12 hours.
 */
export async function getLSTMForecast(historicalData: TrafficDataPoint[]): Promise<TrafficDataPoint[]> {
  const forecast: TrafficDataPoint[] = [];
  const lastTimestamp = historicalData.length > 0 ? new Date(historicalData[historicalData.length - 1].timestamp) : new Date();
  
  // Generate 12 hours of forecast data, one point per hour
  for (let i = 1; i <= 12; i++) {
    const forecastTimestamp = new Date(lastTimestamp.getTime() + i * 60 * 60 * 1000);
    
    // Simulate some trend based on time of day (very basic)
    let congestion = Math.floor(Math.random() * 40) + 30; // Base random congestion
    const hour = forecastTimestamp.getHours();
    if (hour >= 7 && hour <= 9) congestion = Math.min(100, congestion + 30); // Morning rush
    if (hour >= 16 && hour <= 18) congestion = Math.min(100, congestion + 25); // Evening rush
    if (hour <= 5 || hour >= 22) congestion = Math.max(0, congestion - 20); // Late night low

    forecast.push({
      timestamp: forecastTimestamp.toISOString(),
      congestionLevel: Math.max(0, Math.min(100, congestion)), // Ensure value is between 0 and 100
    });
  }
  return forecast;
}
