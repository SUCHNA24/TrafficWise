
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar, PieChart, Pie, Cell } from 'recharts';
import { congestionForecast, type CongestionForecastOutput } from '@/ai/flows/congestion-forecast';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, PieChartIcon, Activity, BarChart3 } from 'lucide-react';
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
          // time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          // Ensure timestamp is valid before creating Date object
          time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Invalid Time',
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
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 bg-card/50">
            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="text-green-500"/>Flow Improvement</CardTitle>
            <CardDescription>Efficiency increase</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-green-600 mb-2">{kpiProgress.flow}%</div>
            <Progress value={kpiProgress.flow} aria-label="Traffic flow improvement" className="h-2 bg-green-500/20 [&>div]:bg-green-500 rounded-full" />
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-4">Target: 40%</CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 bg-card/50">
            <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="text-blue-500"/>Vehicle Pass Rate</CardTitle>
            <CardDescription>Per signal cycle</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">{kpiProgress.passRate}%</div>
            <Progress value={kpiProgress.passRate} aria-label="Vehicle pass rate" className="h-2 bg-blue-500/20 [&>div]:bg-blue-500 rounded-full" />
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-4">Target: 60%</CardFooter>
        </Card>
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 bg-card/50">
            <CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="text-red-500"/>Active Incidents</CardTitle>
            <CardDescription>Currently impacting traffic</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-red-600">5</div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-4">Across all monitored zones</CardFooter>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 bg-card/50">
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-orange-500"/>Avg. Delay Reduction</CardTitle>
            <CardDescription>At key intersections</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-orange-600">12s</div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-4">Compared to previous month</CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-card/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2"><Activity className="text-primary"/>Congestion Forecast vs. Actual (12-Hour)</CardTitle>
                <CardDescription>LSTM predicted congestion levels and actual recorded data.</CardDescription>
              </div>
              {/* <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4"/> Export Data</Button> */}
            </div>
          </CardHeader>
          <CardContent className="h-[400px] pt-6">
            {loadingForecast && <div className="flex items-center justify-center h-full"><p className="text-center text-muted-foreground pt-16">Loading forecast data...</p></div>}
            {forecastError && <div className="flex items-center justify-center h-full"><p className="text-center text-destructive pt-16">{forecastError}</p></div>}
            {!loadingForecast && !forecastError && forecastData && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis label={{ value: 'Congestion / Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: 70 }} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px hsla(var(--shadow-color), 0.1)'}}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}} />
                  <Line type="monotone" dataKey="predictedDensity" name="LSTM Prediction" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, strokeWidth:2, fill:'hsl(var(--background))', stroke: 'hsl(var(--primary))' }} activeDot={{ r: 6, strokeWidth:2, fill:'hsl(var(--primary))' }} />
                  <Line type="monotone" dataKey="density" name="Actual Density" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, strokeWidth:2, fill:'hsl(var(--background))', stroke: 'hsl(var(--accent))' }} activeDot={{ r: 6, strokeWidth:2, fill: 'hsl(var(--accent))' }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-card/50">
            <CardTitle className="text-xl flex items-center gap-2"><PieChartIcon className="text-primary"/>Incident Type Distribution</CardTitle>
            <CardDescription>Breakdown of incidents in the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pt-6 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110} // Increased radius
                  innerRadius={50} // Added inner radius for donut chart
                  dataKey="value"
                  label={({ name, percent, fill }) => <text x={0} y={0} dy={8} textAnchor="middle" fill={fill} fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>}
                  fontSize={13} // Increased label font size
                  stroke="hsl(var(--background))" // Added stroke for separation
                  strokeWidth={2}
                >
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px hsla(var(--shadow-color), 0.1)'}}/>
              </PieChart>
            </ResponsiveContainer>
             <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{fontSize: "12px", marginTop: "15px"}}/>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-card/50">
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
        <CardContent className="h-[350px] pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={filteredHistoricalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis yAxisId="left" label={{ value: 'Traffic Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: 50 }} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Incidents', angle: -90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: -20 }} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px hsla(var(--shadow-color), 0.1)'}}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '600' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
              <Bar yAxisId="left" dataKey="density" name="Traffic Density" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} barSize={25} />
              <Bar yAxisId="right" dataKey="incidents" name="Incidents" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} barSize={25} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

