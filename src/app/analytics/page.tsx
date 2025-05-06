
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar, PieChart, Pie, Cell } from 'recharts';
import { congestionForecast, type CongestionForecastOutput } from '@/ai/flows/congestion-forecast';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, PieChartIcon, Activity, BarChartIcon, Download, ServerCrash, AreaChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

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
          time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Invalid Time',
          predictedDensity: item.congestionLevel,
        }));
        setForecastData(formattedForecast);

      } catch (err: any) {
        console.error("Error fetching congestion forecast:", err);
        if (err.message && err.message.includes("GOOGLE_API_KEY")) {
          setForecastError("Failed to load AI-powered congestion forecast. The Google AI API key is missing or invalid. Please check your environment configuration. Displaying mock data only.");
        } else if (err.message && err.message.includes("No model provider")) {
          setForecastError("AI model provider not configured for congestion forecast. Displaying mock data only.");
        } else {
          setForecastError("Failed to load congestion forecast. Please try again later.");
        }
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
    // If forecast data failed to load, or is not yet available, we use historical data only.
    // We ensure historical data is always available for the chart to render something.
    const baseData = mockHistoricalTrafficData.slice(0, 12); 
    if (forecastData && forecastData.length > 0) {
        return baseData.map((actual, index) => ({
          ...actual,
          predictedDensity: forecastData[index] ? forecastData[index].predictedDensity : null,
        }));
    }
    return baseData.map(actual => ({ ...actual, predictedDensity: null }));
  }, [forecastData]);

  const filteredHistoricalData = useMemo(() => {
    if (timeRange === "last_hour") return mockHistoricalTrafficData.slice(-12); 
    return mockHistoricalTrafficData; 
  }, [timeRange]);

  const KpiCard = ({ title, icon, value, progress, target, description, colorClass }: { title: string, icon: React.ReactNode, value: string | number, progress?: number, target?: string, description: string, colorClass: string }) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg flex items-center gap-2 ${colorClass}`}>
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <div className={`text-4xl font-bold mb-1 ${colorClass}`}>{value}</div>
        {progress !== undefined && <Progress value={progress} aria-label={`${title} progress`} className={`h-2 [&>div]:bg-current rounded-full ${colorClass}`} />}
      </CardContent>
      {target && <CardFooter className="text-xs text-muted-foreground pt-1 pb-3">Target: {target}</CardFooter>}
    </Card>
  );

  const ChartCard: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode; className?: string; actionButton?: React.ReactNode }> = ({ title, description, icon, children, className, actionButton }) => (
    <Card className={`shadow-xl rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="border-b border-border/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">{icon}{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
          {actionButton}
        </div>
      </CardHeader>
      <CardContent className="h-[400px] p-4 pt-6">
        {children}
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-background/50 rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full bg-muted" />
      <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
      <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
    </div>
  );

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full space-y-3 p-8 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg">
      <ServerCrash className="h-12 w-12" />
      <p className="text-lg font-semibold">Oops! Something went wrong.</p>
      <p className="text-sm text-center">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-2 border-destructive text-destructive hover:bg-destructive/20">
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-primary flex items-center justify-center gap-4 mb-2">
          <AreaChart className="h-12 w-12" />
          Analytics Portal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dive deep into traffic patterns, system performance, and incident trends with our advanced analytics.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Flow Improvement" icon={<TrendingUp />} value={`${kpiProgress.flow}%`} progress={kpiProgress.flow} target="40%" description="Efficiency increase YTD" colorClass="text-green-500" />
        <KpiCard title="Vehicle Pass Rate" icon={<CheckCircle2 />} value={`${kpiProgress.passRate}%`} progress={kpiProgress.passRate} target="60%" description="Per signal cycle avg." colorClass="text-blue-500" />
        <KpiCard title="Active Incidents" icon={<AlertCircle />} value="5" description="Currently impacting traffic" colorClass="text-red-500" />
        <KpiCard title="Avg. Delay Reduction" icon={<Clock />} value="12s" description="Key intersections (MoM)" colorClass="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
            title="Congestion Forecast vs. Actual (12-Hour)" 
            description="LSTM predicted congestion levels alongside actual recorded data."
            icon={<Activity/>}
            className="lg:col-span-2"
            actionButton={
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="mr-1.5 h-3.5 w-3.5"/> Export Data
              </Button>
            }
        >
          {loadingForecast && <LoadingSkeleton/>}
          {forecastError && !loadingForecast && <ErrorDisplay message={forecastError} />}
          {!loadingForecast && (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5}/>
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
                <YAxis label={{ value: 'Congestion / Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11, dy: 70 }} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)'}}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: '600', fontSize: '0.8rem' }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))', fontSize: '0.75rem' }}
                />
                <Legend wrapperStyle={{fontSize: "0.75rem", paddingTop: "15px"}}/>
                <Line type="monotone" dataKey="predictedDensity" name="LSTM Prediction" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, strokeWidth:2, fill:'hsl(var(--background))', stroke: 'hsl(var(--primary))' }} activeDot={{ r: 6, strokeWidth:2, fill:'hsl(var(--primary))', stroke:'hsl(var(--background))' }} />
                <Line type="monotone" dataKey="density" name="Actual Density" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, strokeWidth:2, fill:'hsl(var(--background))', stroke: 'hsl(var(--accent))' }} activeDot={{ r: 6, strokeWidth:2, fill: 'hsl(var(--accent))', stroke:'hsl(var(--background))' }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        
        <ChartCard 
            title="Incident Type Distribution" 
            description="Breakdown of incidents in the last 7 days."
            icon={<PieChartIcon/>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentTypeData}
                cx="50%"
                cy="45%" // Adjusted to make space for legend
                labelLine={false}
                outerRadius={100} 
                innerRadius={45} 
                dataKey="value"
                label={({ name, percent, fill, x, y }) => 
                    <text x={x} y={y} dy={4} textAnchor="middle" fill='hsl(var(--popover-foreground))' fontSize={11} fontWeight="500">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                }
                stroke="hsl(var(--background))"
                strokeWidth={3}
              >
                {incidentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"/>
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)'}}/>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{fontSize: "0.75rem", marginTop: "10px"}}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

       <ChartCard 
        title="Historical Traffic Density & Incidents" 
        description="Overview of traffic density and reported incidents over time."
        icon={<BarChartIcon/>}
        actionButton={
             <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[200px] text-xs">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days (mock)</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days (mock)</SelectItem>
              </SelectContent>
            </Select>
        }
       >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={filteredHistoricalData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }} barGap={10} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5}/>
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
            <YAxis yAxisId="left" label={{ value: 'Traffic Density (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11, dy: 50 }} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Incidents', angle: -90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))', fontSize: 11, dy: -20 }} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)'}}
              labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: '600', fontSize: '0.8rem' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))', fontSize: '0.75rem' }}
            />
            <Legend wrapperStyle={{fontSize: "0.75rem", paddingTop: "15px"}}/>
            <Bar yAxisId="left" dataKey="density" name="Traffic Density" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="incidents" name="Incidents" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

