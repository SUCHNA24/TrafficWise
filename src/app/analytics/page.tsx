
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar, PieChart, Pie, Cell } from 'recharts';
import { congestionForecast, type CongestionForecastOutput } from '@/ai/flows/congestion-forecast';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, PieChartIcon, Activity } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockHistoricalTrafficData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  density: Math.floor(Math.random() * 60) + 20, // Random density 20-80
  incidents: Math.floor(Math.random() * 3), // Random incidents 0-2
}));

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const incidentTypeData = [
  { name: 'Accidents', value: 45, fill: 'hsl(var(--destructive))' },
  { name: 'Road Works', value: 25, fill: 'hsl(var(--chart-3))' },
  { name: 'Weather Alerts', value: 15, fill: 'hsl(var(--chart-4))' },
  { name: 'Congestion', value: 15, fill: 'hsl(var(--chart-5))' },
];

export default function AnalyticsPage() {
  const [forecastData, setForecastData] = useState<CongestionForecastOutput['forecastData'] | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const [kpiProgress, setKpiProgress] = useState({ flow: 0, passRate: 0 });
  const [timeRange, setTimeRange] = useState<string>("last_24_hours");

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoadingForecast(true);
        setForecastError(null);
        const result = await congestionForecast({});
        
        const formattedForecast = result.forecastData.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          predictedDensity: item.congestionLevel,
        }));
        setForecastData(formattedForecast);

      } catch (err) {
        console.error("Error fetching congestion forecast:", err);
        setForecastError("Failed to load congestion forecast. Please try again later.");
      } finally {
        setLoadingForecast(false);
      }
    }
    fetchForecast();
  }, []);

  useEffect(() => {
    const flowTimer = setTimeout(() => setKpiProgress(prev => ({ ...prev, flow: 35 })), 500);
    const passRateTimer = setTimeout(() => setKpiProgress(prev => ({ ...prev, passRate: 52 })), 700);
    return () => {
      clearTimeout(flowTimer);
      clearTimeout(passRateTimer);
    };
  }, []);

  const combinedChartData = useMemo(() => {
    // Use the first 12 hours of mock historical data to align with 12-hour forecast
    const relevantHistoricalData = mockHistoricalTrafficData.slice(0, 12);
    return relevantHistoricalData.map((actual, index) => ({
      ...actual,
      predictedDensity: forecastData && forecastData[index] ? forecastData[index].predictedDensity : null,
    }));
  }, [forecastData]);

  const filteredHistoricalData = useMemo(() => {
    // Placeholder for actual time range filtering logic
    if (timeRange === "last_hour") return mockHistoricalTrafficData.slice(-12); // Assuming 5-min intervals for last hour
    return mockHistoricalTrafficData; // Default to last 24 hours
  }, [timeRange]);


  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <BarChart3 className="h-10 w-10" />
          Analytics Portal
        </h1>
        <p className="text-muted-foreground mt-1">Insights into traffic patterns, system performance, and incident trends.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="text-green-500"/>Flow Improvement</CardTitle>
            <CardDescription>Efficiency increase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">{kpiProgress.flow}%</div>
            <Progress value={kpiProgress.flow} aria-label="Traffic flow improvement" className="h-2 bg-green-500/20 [&>div]:bg-green-500" />
          </CardContent>
          <CardFooter><p className="text-xs text-muted-foreground">Target: 40%</p></CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="text-blue-500"/>Vehicle Pass Rate</CardTitle>
            <CardDescription>Per signal cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 mb-2">{kpiProgress.passRate}%</div>
            <Progress value={kpiProgress.passRate} aria-label="Vehicle pass rate" className="h-2 bg-blue-500/20 [&>div]:bg-blue-500" />
          </CardContent>
          <CardFooter><p className="text-xs text-muted-foreground">Target: 60%</p></CardFooter>
        </Card>
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="text-red-500"/>Active Incidents</CardTitle>
            <CardDescription>Currently impacting traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">5</div>
          </CardContent>
          <CardFooter><p className="text-xs text-muted-foreground">Across all monitored zones</p></CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-orange-500"/>Avg. Delay Reduction</CardTitle>
            <CardDescription>At key intersections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">12s</div>
          </CardContent>
          <CardFooter><p className="text-xs text-muted-foreground">Compared to previous month</p></CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2"><Activity className="text-primary"/>Congestion Forecast vs. Actual (12-Hour)</CardTitle>
                <CardDescription>LSTM predicted congestion levels and actual recorded data.</CardDescription>
              </div>
              {/* <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4"/> Export Data</Button> */}
            </div>
          </CardHeader>
          <CardContent className="h-[400px] pt-4">
            {loadingForecast && <p className="text-center text-muted-foreground pt-16">Loading forecast data...</p>}
            {forecastError && <p className="text-center text-destructive pt-16">{forecastError}</p>}
            {!loadingForecast && !forecastError && forecastData && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis label={{ value: 'Congestion / Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: 70 }} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}} />
                  <Line type="monotone" dataKey="predictedDensity" name="LSTM Prediction" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, strokeWidth:1, fill:'hsl(var(--primary))' }} activeDot={{ r: 5, strokeWidth:2 }} />
                  <Line type="monotone" dataKey="density" name="Actual Density" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, strokeWidth:1, fill:'hsl(var(--accent))' }} activeDot={{ r: 5, strokeWidth:2 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><PieChartIcon className="text-primary"/>Incident Type Distribution</CardTitle>
            <CardDescription>Breakdown of incidents in the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pt-4 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={12}
                  
                >
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
              </PieChart>
            </ResponsiveContainer>
             <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{fontSize: "12px", marginTop: "10px"}}/>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><Clock className="text-primary"/>Historical Traffic Density & Incidents</CardTitle>
                <CardDescription>Overview of traffic density and reported incidents over time.</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days (mock)</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days (mock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={filteredHistoricalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="left" label={{ value: 'Traffic Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: 50 }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Incidents', angle: -90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: -20 }} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Bar yAxisId="left" dataKey="density" name="Traffic Density" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="incidents" name="Incidents" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} barSize={20} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
