import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { MapPin, Layers, Clock, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CongestionMapPage() {
  // In a real app, these would come from an API or state management
  const mapLayers = [
    { id: 'congestion', name: 'Congestion Heatmap', enabled: true },
    { id: 'incidents', name: 'Incident Markers', enabled: true },
    { id: 'cameras', name: 'Camera Locations', enabled: false },
    { id: 'signals', name: 'Signal Status', enabled: false },
  ];

  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <MapPin className="h-8 w-8" />
          Interactive Congestion Map
        </h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select defaultValue="now">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Current
                </div>
              </SelectItem>
              <SelectItem value="1hr">
                 <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Next 1 Hour (Forecast)
                </div>
              </SelectItem>
              <SelectItem value="12hr">
                 <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Next 12 Hours (Forecast)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <ZoomIn className="h-4 w-4"/>
            <span className="sr-only">Zoom to Fit</span>
          </Button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-xl">
          <CardContent className="p-0 h-full">
            {/* Placeholder for Mapbox GL. For now, a static image. */}
            <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0">
              <Image
                src="https://picsum.photos/seed/interactivemap/1200/800"
                alt="Interactive Map Placeholder"
                width={1200}
                height={800}
                className="object-cover w-full h-full"
                data-ai-hint="city traffic aerial"
              />
              <p className="absolute text-lg text-background/80 bg-foreground/50 p-2 rounded">Mapbox GL Integration Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary"/>Map Layers</CardTitle>
            <CardDescription>Toggle visibility of map features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mapLayers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <Label htmlFor={layer.id} className="text-sm font-medium">{layer.name}</Label>
                <Switch id={layer.id} defaultChecked={layer.enabled} aria-label={`Toggle ${layer.name}`} />
              </div>
            ))}
             <Button className="w-full mt-4">Apply Filters</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
