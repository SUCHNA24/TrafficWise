
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Video, Lightbulb, AlertTriangle, BarChart3, TrendingUp, Users } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Added import for cn

export default function DashboardPage() {
  const [vehicleCounts, setVehicleCounts] = useState<number[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    setVehicleCounts([
      Math.floor(Math.random() * 20) + 5,
      Math.floor(Math.random() * 20) + 5,
    ]);

    const updateTime = () => {
      setCurrentDateTime(new Date().toLocaleString([], { dateStyle: 'full', timeStyle: 'medium' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
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
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">{content}</CardContent>
      {ctaLink && ctaText && (
        <CardFooter className="mt-auto pt-4">
          <Button variant="outline" className="w-full" asChild>
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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to TrafficWise Dashboard</CardTitle>
          <CardDescription className="text-primary-foreground/80">{currentDateTime || 'Loading date and time...'}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Overview of the city's intelligent traffic management system. Monitor live feeds, analyze trends, and manage incidents effectively.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardItem
          className="lg:col-span-2"
          title="Real-Time Camera Feeds"
          icon={<Video className="h-6 w-6 text-primary" />}
          description="Live traffic views with AI-powered vehicle detection."
          content={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden shadow-md group transition-transform hover:scale-105">
                  <Image
                    src={`https://picsum.photos/seed/cam${i}/640/360`}
                    alt={`Live Camera Feed ${i}`}
                    fill
                    style={{objectFit: "cover"}}
                    data-ai-hint="traffic camera"
                    className="group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-3">
                    <p className="text-white text-base font-semibold drop-shadow-md">Camera Feed {i}</p>
                    <div className="bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded self-start">
                      {renderVehicleCounts(i-1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          ctaLink="/cameras"
          ctaText="View All Camera Feeds"
        />

        <CardItem
          title="Interactive Congestion Map"
          icon={<MapPin className="h-6 w-6 text-primary" />}
          description="Color-coded heatmaps of current traffic conditions."
          content={
            <div className="relative aspect-square bg-secondary rounded-lg flex items-center justify-center overflow-hidden shadow-md group transition-transform hover:scale-105">
              <Image
                src="https://picsum.photos/seed/map/400/400"
                alt="Congestion Map Placeholder"
                width={400}
                height={400}
                className="object-cover group-hover:opacity-90 transition-opacity"
                data-ai-hint="city map aerial"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <MapPin className="h-12 w-12 text-white/80" />
              </div>
            </div>
          }
          ctaLink="/map"
          ctaText="View Full Map"
        />

        <CardItem
          title="Signal Status Overview"
          icon={<Lightbulb className="h-6 w-6 text-primary" />}
          description="Real-time traffic light phases and priority status."
          content={
            <div className="space-y-3">
              {[
                { name: "Main St & 1st Ave", phase: "Northbound Green", time: 25, priority: "None" },
                { name: "Oak Rd & Pine Ln", phase: "Eastbound Caution", time: 8, priority: "Emergency Vehicle" }
              ].map((intersection) => (
                <div key={intersection.name} className="p-3 bg-secondary/60 rounded-lg shadow-sm hover:bg-secondary transition-colors">
                  <h4 className="font-semibold text-card-foreground">{intersection.name}</h4>
                  <div className="flex items-center justify-between mt-1 text-sm">
                    <span className="text-muted-foreground">{intersection.phase}</span>
                    <span className={`font-bold ${intersection.phase.includes("Green") ? 'text-green-600' : 'text-yellow-600'}`}>{intersection.time}s</span>
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
          title="Traffic Analytics Highlights"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          description="Key performance indicators and recent trends."
          content={
            <div className="space-y-3">
              {[
                { label: "Traffic Flow Improvement", value: "+35%", icon: <TrendingUp className="text-green-500" />, subtext: "vs Baseline" },
                { label: "Avg. Vehicle Pass Rate", value: "+50%", icon: <Users className="text-blue-500" />, subtext: "Per Cycle" }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-secondary/60 rounded-lg shadow-sm hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md">{item.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.subtext}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          }
          ctaLink="/analytics"
          ctaText="View Detailed Analytics"
        />

        <CardItem
          title="Active Incidents Summary"
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          description="Real-time alerts for accidents and road issues."
          content={
            <div className="space-y-3">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg shadow-sm hover:bg-destructive/20 transition-colors">
                <h4 className="font-semibold text-destructive">Accident: Hwy 101 @ Exit 5</h4>
                <p className="text-sm text-destructive/80">Reported: 10 min ago. Minor delays.</p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg shadow-sm hover:bg-yellow-500/20 transition-colors">
                <h4 className="font-semibold text-yellow-600">Weather Alert: Downtown</h4>
                <p className="text-sm text-yellow-700/80">Heavy rain expected. Drive with caution.</p>
              </div>
            </div>
          }
          ctaLink="/incidents"
          ctaText="View All Incidents"
        />
      </div>
    </div>
  );
}

