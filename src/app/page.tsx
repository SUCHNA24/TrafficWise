'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Video, Lightbulb, AlertTriangle, BarChart3 } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

export default function DashboardPage() {
  const [vehicleCounts, setVehicleCounts] = useState<number[]>([]);

  useEffect(() => {
    // Generate random numbers only on the client side after hydration
    setVehicleCounts([
      Math.floor(Math.random() * 20) + 5,
      Math.floor(Math.random() * 20) + 5,
    ]);
  }, []);


  interface CardItemProps {
    title: string;
    icon: ReactNode;
    description: string;
    content: ReactNode;
    className?: string;
  }

  const CardItem: React.FC<CardItemProps> = ({ title, icon, description, content, className }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );

  const renderVehicleCounts = (index: number) => {
    if (vehicleCounts.length > index) {
      return `Vehicles Detected: ${vehicleCounts[index]}`;
    }
    return "Loading...";
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CardItem
        className="lg:col-span-2"
        title="Real-Time Camera Feeds"
        icon={<Video className="h-6 w-6 text-primary" />}
        description="Live traffic views with AI-powered vehicle detection."
        content={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="relative aspect-video rounded-md overflow-hidden shadow-md">
                <Image
                  src={`https://picsum.photos/seed/cam${i}/640/360`}
                  alt={`Live Camera Feed ${i}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="traffic camera"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">Camera Feed {i}</p>
                </div>
                <div className="absolute bottom-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                  {renderVehicleCounts(i-1)}
                </div>
              </div>
            ))}
          </div>
        }
      />

      <CardItem
        title="Interactive Congestion Map"
        icon={<MapPin className="h-6 w-6 text-primary" />}
        description="Color-coded heatmaps of current traffic conditions."
        content={
          <>
            <div className="aspect-square bg-secondary rounded-md flex items-center justify-center overflow-hidden shadow-md">
              <Image
                src="https://picsum.photos/seed/map/400/400"
                alt="Congestion Map Placeholder"
                width={400}
                height={400}
                className="object-cover"
                data-ai-hint="traffic map"
              />
            </div>
            <Button variant="outline" className="w-full mt-4 asChild">
              <Link href="/map">View Full Map</Link>
            </Button>
          </>
        }
      />

      <CardItem
        title="Signal Status"
        icon={<Lightbulb className="h-6 w-6 text-primary" />}
        description="Real-time traffic light phases and countdowns."
        content={
          <div className="space-y-4">
            {["Main St & 1st Ave", "Oak Rd & Pine Ln"].map((intersection) => (
              <div key={intersection} className="p-3 bg-secondary rounded-md shadow">
                <h4 className="font-semibold">{intersection}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Phase: Northbound Green</span>
                  <span className="text-lg font-bold text-green-600">25s</span>
                </div>
              </div>
            ))}
          </div>
        }
      />

      <CardItem
        title="Traffic Analytics"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        description="Key performance indicators and trends."
        content={
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-secondary rounded-md shadow">
                <div>
                  <p className="text-sm font-medium">Traffic Flow Improvement</p>
                  <p className="text-xs text-muted-foreground">Compared to baseline</p>
                </div>
                <p className="text-xl font-bold text-green-600">+35%</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded-md shadow">
                <div>
                  <p className="text-sm font-medium">Vehicle Pass Rate</p>
                  <p className="text-xs text-muted-foreground">Per signal cycle</p>
                </div>
                <p className="text-xl font-bold text-green-600">+50%</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 asChild">
              <Link href="/analytics">View Detailed Analytics</Link>
            </Button>
          </>
        }
      />

      <CardItem
        title="Active Incidents"
        icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
        description="Real-time alerts for accidents and road issues."
        content={
          <>
            <div className="space-y-3">
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md shadow">
                <h4 className="font-semibold text-destructive">Accident: Hwy 101 @ Exit 5</h4>
                <p className="text-sm text-muted-foreground">Reported: 10 min ago. Minor delays.</p>
              </div>
              <div className="p-3 bg-yellow-400/20 border border-yellow-500/40 rounded-md shadow">
                <h4 className="font-semibold text-yellow-700">Weather Alert: Downtown</h4>
                <p className="text-sm text-muted-foreground">Heavy rain expected. Drive with caution.</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 asChild">
              <Link href="/incidents">View All Incidents</Link>
            </Button>
          </>
        }
      />
    </div>
  );
}
