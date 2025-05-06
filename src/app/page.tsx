import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Video, Lightbulb, AlertTriangle, BarChart3 } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Real-Time Camera Feeds
          </CardTitle>
          <CardDescription>Live traffic views with AI-powered vehicle detection.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Vehicles Detected: {Math.floor(Math.random() * 20) + 5}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Interactive Congestion Map
          </CardTitle>
          <CardDescription>Color-coded heatmaps of current traffic conditions.</CardDescription>
        </CardHeader>
        <CardContent>
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
          <Button variant="outline" className="w-full mt-4">
            <Link href="/map">View Full Map</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Signal Status
          </CardTitle>
          <CardDescription>Real-time traffic light phases and countdowns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Main St & 1st Ave", "Oak Rd & Pine Ln"].map((intersection) => (
            <div key={intersection} className="p-3 bg-secondary rounded-md shadow">
              <h4 className="font-semibold">{intersection}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Phase: Northbound Green</span>
                <span className="text-lg font-bold text-green-600">25s</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Traffic Analytics
          </CardTitle>
          <CardDescription>Key performance indicators and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
           <Button variant="outline" className="w-full mt-2">
            <Link href="/analytics">View Detailed Analytics</Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Active Incidents
          </CardTitle>
          <CardDescription>Real-time alerts for accidents and road issues.</CardDescription>
        </CardHeader>
        <CardContent>
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
           <Button variant="outline" className="w-full mt-4">
            <Link href="/incidents">View All Incidents</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
