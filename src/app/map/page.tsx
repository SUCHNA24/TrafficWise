
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { MapPin, Layers, Clock, ZoomIn, Route, AlertTriangle, VideoIcon, TrafficConeIcon } from "lucide-react"; // Added more icons
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
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  icon: React.ReactNode;
  colorClass: string; // Tailwind color class for icon/badge
}

const initialMapLayers: MapLayer[] = [
  { id: 'congestion', name: 'Congestion Heatmap', enabled: true, icon: <Route className="h-4 w-4"/>, colorClass: "text-red-500" },
  { id: 'incidents', name: 'Incident Markers', enabled: true, icon: <AlertTriangle className="h-4 w-4"/>, colorClass: "text-orange-500" },
  { id: 'cameras', name: 'Camera Locations', enabled: false, icon: <VideoIcon className="h-4 w-4"/>, colorClass: "text-blue-500" },
  { id: 'signals', name: 'Signal Status', enabled: false, icon: <TrafficConeIcon className="h-4 w-4"/>, colorClass: "text-green-500" },
];

export default function CongestionMapPage() {
  const { toast } = useToast();
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(initialMapLayers);
  const [selectedTimeframe, setSelectedTimeframe] = useState("now");
  const [mapSeed, setMapSeed] = useState("interactivemap_default"); 
  const [mapZoomLevel, setMapZoomLevel] = useState(12); // Mock zoom level

  useEffect(() => {
    const activeLayers = mapLayers.filter(l => l.enabled).map(l => l.id).join('-');
    setMapSeed(`map-${selectedTimeframe}-${activeLayers || 'none'}-zoom${mapZoomLevel}`);
  }, [mapLayers, selectedTimeframe, mapZoomLevel]);

  const handleLayerToggle = (layerId: string, checked: boolean) => {
    setMapLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, enabled: checked } : layer
      )
    );
    toast({
      title: "Layer Updated",
      description: `${mapLayers.find(l => l.id === layerId)?.name} layer ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    toast({
      title: "Timeframe Changed",
      description: `Map timeframe set to: ${
        value === "now" ? "Current Conditions" : 
        value === "1hr" ? "Next 1 Hour (Forecast)" : 
        "Next 12 Hours (Forecast)"
      }.`,
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setMapZoomLevel(prevZoom => {
      const newZoom = direction === 'in' ? Math.min(18, prevZoom + 1) : Math.max(8, prevZoom - 1);
      toast({ title: `Zoom ${direction}`, description: `Map zoomed to level ${newZoom}. (Mock action)` });
      return newZoom;
    });
  };
  
  const handleZoomToFit = () => {
    setMapZoomLevel(12); // Reset to a default overview zoom
    toast({ title: "Zoom to Fit", description: "Map view reset to overview. (Mock action)" });
  };


  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <MapPin className="h-10 w-10" />
          Interactive Congestion Map
        </h1>
        <p className="text-muted-foreground mt-1">Visualize real-time traffic flow, incidents, and forecasts.</p>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-xl flex flex-col">
          <CardHeader className="border-b p-4 flex-row justify-between items-center">
            <div className="flex items-center gap-3">
               <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-full sm:w-[240px] bg-background"> 
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Current Conditions</SelectItem>
                  <SelectItem value="1hr">Next 1 Hour (Forecast)</SelectItem>
                  <SelectItem value="12hr">Next 12 Hours (Forecast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleZoom('out')} title="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleZoom('in')} title="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomToFit} title="Zoom to Fit">
                <ZoomIn className="h-4 w-4"/>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow relative bg-muted/30">
            <div className="w-full h-full rounded-b-lg flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0">
              <Image
                src={`https://picsum.photos/seed/${mapSeed}/1200/800`}
                alt="Interactive Map Placeholder"
                fill
                style={{objectFit: "cover"}}
                className="object-cover w-full h-full transition-opacity duration-500"
                key={mapSeed} 
                data-ai-hint="city traffic aerial"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent p-4 flex flex-col justify-end">
                <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-lg self-start">
                    <p className="text-sm font-medium text-foreground">Mapbox GL Integration</p>
                    <p className="text-xs text-muted-foreground">Zoom: {mapZoomLevel} | Layers: {mapLayers.filter(l => l.enabled).length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg"><Layers className="h-5 w-5 text-primary"/>Map Layers</CardTitle>
            <CardDescription className="text-sm">Toggle visibility of map features.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 flex-grow">
            {mapLayers.map(layer => (
              <div 
                key={layer.id} 
                className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 rounded-md border transition-colors"
              >
                <Label htmlFor={layer.id} className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${layer.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <span className={layer.colorClass}>{layer.icon}</span>
                  {layer.name}
                </Label>
                <Switch 
                  id={layer.id} 
                  checked={layer.enabled} 
                  onCheckedChange={(checked) => handleLayerToggle(layer.id, checked)}
                  aria-label={`Toggle ${layer.name}`} 
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-4 border-t">
             <Button className="w-full" onClick={() => toast({title: "Applying Changes", description: "Map view updated with selected layers."})}>
                Apply Layer Changes
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
