
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Video, Lightbulb, AlertTriangle, BarChart3, TrendingUp, Users, Gauge } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; 

export default function DashboardPage() {
  const [vehicleCounts, setVehicleCounts] = useState<number[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [systemStatus, setSystemStatus] = useState<{ status: "Optimal" | "Warning" | "Critical", message: string }>({ status: "Optimal", message: "All systems operational."});
  const [activeIncidentsCount, setActiveIncidentsCount] = useState(2); // Mock data


  useEffect(() => {
    setVehicleCounts([
      Math.floor(Math.random() * 20) + 15,
      Math.floor(Math.random() * 20) + 10,
    ]);

    const updateTime = () => {
      setCurrentDateTime(new Date().toLocaleString([], { dateStyle: 'full', timeStyle: 'medium' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    
    // Simulate system status changes
    const statusInterval = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.05) setSystemStatus({ status: "Critical", message: "Major system outage detected!"});
        else if (rand < 0.2) setSystemStatus({ status: "Warning", message: "Minor network congestion reported."});
        else setSystemStatus({ status: "Optimal", message: "All systems operational."});
        setActiveIncidentsCount(Math.floor(Math.random() * 5));
    }, 15000);

    return () => {
      clearInterval(timerId);
      clearInterval(statusInterval);
    };
  }, []);


  interface CardItemProps {
    title: string;
    icon: ReactNode;
    description: string;
    content: ReactNode;
    className?: string;
    ctaLink?: string;
    ctaText?: string;
  }

  const CardItem: React.FC<CardItemProps> = ({ title, icon, description, content, className, ctaLink, ctaText }) => (
    <Card className={cn("shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card/80 backdrop-blur-sm transform hover:scale-[1.02]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-lg text-primary">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-4">{content}</CardContent>
      {ctaLink && ctaText && (
        <CardFooter className="mt-auto pt-3 pb-4">
          <Button variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors" asChild>
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const renderVehicleCounts = (index: number) => {
    if (vehicleCounts.length > index) {
      return `Vehicles: ${vehicleCounts[index]}`;
    }
    return "Loading...";
  }
  
  const getStatusColor = () => {
    if (systemStatus.status === "Critical") return "bg-destructive text-destructive-foreground";
    if (systemStatus.status === "Warning") return "bg-yellow-500 text-yellow-foreground";
    return "bg-green-600 text-green-foreground";
  }

  return (
    <div className="space-y-8">
      <Card className={cn("bg-gradient-to-br from-primary via-accent to-primary/70 text-primary-foreground shadow-2xl rounded-xl overflow-hidden", getStatusColor())}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-extrabold">TrafficWise Dashboard</CardTitle>
              <CardDescription className="text-primary-foreground/80 mt-1 text-sm">{currentDateTime || 'Loading date and time...'}</CardDescription>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/20 backdrop-blur-sm">
                <Gauge className="h-6 w-6" />
                <span className="text-sm font-semibold">{systemStatus.status}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base">{systemStatus.message}</p>
          <p className="text-sm mt-2">Active Incidents: <Link href="/incidents" className="font-bold underline hover:text-primary-foreground/70">{activeIncidentsCount}</Link></p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CardItem
          className="lg:col-span-2 xl:col-span-2"
          title="Real-Time Camera Feeds"
          icon={<Video className="h-6 w-6" />}
          description="Live traffic views with AI-powered vehicle detection."
          content={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Link key={i} href="/cameras" className="block relative aspect-[16/10] rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:ring-4 hover:ring-primary/50">
                  <Image
                    src={`https://picsum.photos/seed/cam${i}_dashboard/640/400`}
                    alt={`Live Camera Feed ${i}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{objectFit: "cover"}}
                    data-ai-hint="traffic camera city"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-base font-semibold drop-shadow-md">Intersection View {i}</p>
                    <div className="bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 rounded-full self-start mt-1 shadow-md">
                      {renderVehicleCounts(i-1)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          }
          ctaLink="/cameras"
          ctaText="View All Camera Feeds"
        />

        <CardItem
          className="xl:col-span-1"
          title="Interactive Congestion Map"
          icon={<MapPin className="h-6 w-6" />}
          description="Color-coded heatmaps of current traffic conditions."
          content={
            <Link href="/map" className="block relative aspect-square bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden shadow-lg group transition-all duration-300 hover:ring-4 hover:ring-primary/50">
              <Image
                src="https://picsum.photos/seed/map_dashboard/400/400"
                alt="Congestion Map Placeholder"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 25vw, 400px"
                style={{objectFit: "cover"}}
                className="group-hover:scale-105 transition-transform duration-300"
                data-ai-hint="city map aerial"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <MapPin className="h-16 w-16 text-white/90 drop-shadow-xl" />
              </div>
            </Link>
          }
          ctaLink="/map"
          ctaText="View Full Map"
        />

        <CardItem
          className="xl:col-span-1"
          title="Signal Status Overview"
          icon={<Lightbulb className="h-6 w-6" />}
          description="Real-time traffic light phases and priority status."
          content={
            <div className="space-y-3.5">
              {[
                { name: "Main St & 1st Ave", phase: "Northbound Green", time: 25, priority: "None" },
                { name: "Oak Rd & Pine Ln", phase: "Eastbound Caution", time: 8, priority: "Emergency Vehicle" },
                { name: "Elm St & High St", phase: "Pedestrian Crossing", time: 15, priority: "None" }
              ].map((intersection) => (
                <div key={intersection.name} className="p-3.5 bg-secondary/70 rounded-lg shadow-sm hover:bg-secondary transition-colors duration-200 cursor-pointer" onClick={() => window.location.href='/control'}>
                  <h4 className="font-semibold text-card-foreground text-sm">{intersection.name}</h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-muted-foreground">{intersection.phase}</span>
                    <span className={`font-bold ${intersection.phase.includes("Green") ? 'text-green-600 dark:text-green-400' : intersection.phase.includes("Caution") ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>{intersection.time}s</span>
                  </div>
                  {intersection.priority !== "None" && (
                     <p className="text-xs text-accent font-medium mt-1">{intersection.priority} Priority Active</p>
                  )}
                </div>
              ))}
            </div>
          }
          ctaLink="/control"
          ctaText="Manage Signal Controls"
        />

        <CardItem
          className="lg:col-span-2 xl:col-span-2"
          title="Traffic Analytics Highlights"
          icon={<BarChart3 className="h-6 w-6" />}
          description="Key performance indicators and recent trends."
          content={
            <div className="space-y-3.5">
              {[
                { label: "Avg. Traffic Flow", value: "+18%", icon: <TrendingUp className="text-green-500" />, subtext: "vs Last Month" },
                { label: "Incident Response Time", value: "-12%", icon: <AlertTriangle className="text-blue-500" />, subtext: "Improvement YTD" },
                { label: "Active System Users", value: "47", icon: <Users className="text-purple-500" />, subtext: "Online Now" }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center p-3.5 bg-secondary/70 rounded-lg shadow-sm hover:bg-secondary transition-colors duration-200 cursor-pointer" onClick={() => window.location.href='/analytics'}>
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-background rounded-lg shadow-inner">{item.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.subtext}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          }
          ctaLink="/analytics"
          ctaText="View Detailed Analytics"
        />

        <CardItem
          className="lg:col-span-1 xl:col-span-2"
          title="Active Incidents Summary"
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          description="Real-time alerts for accidents and road issues."
          content={
            <div className="space-y-3.5">
              {[
                { type: "Major Accident", location: "Hwy 101 @ Exit 5", time: "10 min ago", severity: "Critical" },
                { type: "Road Closure", location: "Oak St (Elm to Pine)", time: "Scheduled 2h", severity: "Medium"},
                { type: "Signal Malfunction", location: "Park Ave & Lake Rd", time: "5 min ago", severity: "High" }
              ].map((incident, idx) => (
                <div key={idx} className={`p-3.5 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                    incident.severity === "Critical" ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20' :
                    incident.severity === "High" ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20' :
                    'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                }`} onClick={() => window.location.href='/incidents'}>
                  <h4 className={`font-semibold text-sm ${
                      incident.severity === "Critical" ? 'text-destructive' :
                      incident.severity === "High" ? 'text-orange-600 dark:text-orange-400' :
                      'text-yellow-700 dark:text-yellow-500'
                  }`}>{incident.type}: {incident.location}</h4>
                  <p className={`text-xs ${
                      incident.severity === "Critical" ? 'text-destructive/80' :
                      incident.severity === "High" ? 'text-orange-600/80 dark:text-orange-400/80' :
                      'text-yellow-700/80 dark:text-yellow-500/80'
                  }`}>Reported: {incident.time}. Severity: {incident.severity}</p>
                </div>
              ))}
            </div>
          }
          ctaLink="/incidents"
          ctaText="View All Incidents"
        />
      </div>
    </div>
  );
}
