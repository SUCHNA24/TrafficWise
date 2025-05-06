'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar } from 'recharts';
import { congestionForecast, type CongestionForecastOutput } from '@/ai/flows/congestion-forecast';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Mock data for actual traffic density (replace with real data)
const actualTrafficData = [
  { time: '00:00', density: 30 }, { time: '01:00', density: 25 }, { time: '02:00', density: 20 },
  { time: '03:00', density: 18 }, { time: '04:00', density: 22 }, { time: '05:00', density: 35 },
  { time: '06:00', density: 50 }, { time: '07:00', density: 70 }, { time: '08:00', density: 85 },
  { time: '09:00', density: 75 }, { time: '10:00', density: 60 }, { time: '11:00', density: 55 },
];

export default function AnalyticsPage() {
  const [forecastData, setForecastData] = useState<CongestionForecastOutput['forecastData'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);


  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        setError(null);
        const result = await congestionForecast({});
        
        // Map forecast data to match chart structure
        const formattedForecast = result.forecastData.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          predictedDensity: item.congestionLevel,
        }));
        setForecastData(formattedForecast);

      } catch (err) {
        console.error("Error fetching congestion forecast:", err);
        setError("Failed to load congestion forecast. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, []);

  useEffect(() => {
    // Simulate progress for traffic flow improvement
    const timer = setTimeout(() => setProgressValue(35), 500);
    return () => clearTimeout(timer);
  }, []);


  const combinedChartData = actualTrafficData.map((actual, index) => ({
    ...actual,
    predictedDensity: forecastData && forecastData[index] ? forecastData[index].predictedDensity : null,
  }));


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Analytics Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-primary"/>Traffic Flow Improvement</CardTitle>
            <CardDescription>Percentage increase in traffic movement efficiency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
            <Progress value={progressValue} aria-label="Traffic flow improvement progress" />
            <p className="text-sm text-muted-foreground mt-1">Target: 40%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-primary"/>Vehicle Pass Rate</CardTitle>
            <CardDescription>Increase in vehicles passing per signal cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
            <p className="text-sm text-muted-foreground">Average increase across major intersections.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>12-Hour Congestion Forecast vs. Actual</CardTitle>
          <CardDescription>Comparison of LSTM predicted congestion levels and actual recorded data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {loading && <p className="text-center text-muted-foreground">Loading forecast data...</p>}
          {error && <p className="text-center text-destructive">{error}</p>}
          {!loading && !error && forecastData && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'Congestion Level / Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictedDensity" name="LSTM Prediction" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="density" name="Actual Density" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertCircle className="text-primary"/>Incident Reports Summary</CardTitle>
          <CardDescription>Overview of recent traffic incidents and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary rounded-lg shadow">
              <h3 className="font-semibold text-lg">Accidents</h3>
              <p className="text-3xl font-bold text-destructive">5</p>
              <p className="text-sm text-muted-foreground">In the last 24 hours</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg shadow">
              <h3 className="font-semibold text-lg">Weather Alerts</h3>
              <p className="text-3xl font-bold text-yellow-500">2</p>
              <p className="text-sm text-muted-foreground">Currently active</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg shadow">
              <h3 className="font-semibold text-lg">Road Closures</h3>
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Due to construction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
