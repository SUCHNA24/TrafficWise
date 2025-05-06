
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Eye, Lightbulb, ShieldAlert, Shuffle, SlidersHorizontal, TrafficCone, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className }) => (
  <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
    <CardHeader className="items-center text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-3 inline-block">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0">
            <Image 
                src="https://picsum.photos/seed/citylights/1920/1080" 
                alt="City Traffic at Night"
                fill
                style={{objectFit: "cover"}}
                className="opacity-20"
                data-ai-hint="city traffic night"
                priority
            />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <TrafficCone className="w-20 h-20 mx-auto mb-6 text-accent animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Welcome to TrafficWise
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto drop-shadow-md">
            Revolutionizing urban mobility with intelligent AI-powered traffic management.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore the powerful tools TrafficWise offers to optimize traffic flow and enhance city safety.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Eye className="h-10 w-10 text-primary" />}
              title="Real-Time Monitoring"
              description="Live camera feeds and interactive maps provide a comprehensive overview of traffic conditions across the city."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Advanced Analytics"
              description="Gain deep insights from historical data and AI-driven forecasts to predict congestion and improve planning."
            />
            <FeatureCard
              icon={<SlidersHorizontal className="h-10 w-10 text-primary" />}
              title="Smart Signal Control"
              description="Dynamically adjust traffic signals based on real-time demand, prioritizing emergency and public transport."
            />
            <FeatureCard
              icon={<ShieldAlert className="h-10 w-10 text-primary" />}
              title="Incident Management"
              description="Rapidly detect, report, and manage traffic incidents to minimize disruption and enhance public safety."
            />
             <FeatureCard
              icon={<Video className="h-10 w-10 text-primary" />}
              title="AI-Enhanced Cameras"
              description="Utilize AI for vehicle detection, pedestrian counting, and anomaly identification through camera feeds."
            />
             <FeatureCard
              icon={<Shuffle className="h-10 w-10 text-primary" />}
              title="Adaptive Routing"
              description="Suggest optimal routes based on real-time traffic data, reducing travel time and emissions."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Optimize Your City's Traffic?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the future of traffic management. Explore the TrafficWise dashboard to see our system in action.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
