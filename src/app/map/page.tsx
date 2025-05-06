
'use client';

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
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
}

const initialMapLayers: MapLayer[] = [
  { id: 'congestion', name: 'Congestion Heatmap', enabled: true },
  { id: 'incidents', name: 'Incident Markers', enabled: true },
  { id: 'cameras', name: 'Camera Locations', enabled: false },
  { id: 'signals', name: 'Signal Status', enabled: false },
];

export default function CongestionMapPage() {
  const { toast } = useToast();
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(initialMapLayers);
  const [selectedTimeframe, setSelectedTimeframe] = useState("now");
  const [mapSeed, setMapSeed] = useState("interactivemap"); // For changing the placeholder image

  useEffect(() => {
    // This effect could fetch new map data or update map configuration
    // when layers or timeframe change. For now, just changes image seed.
    const activeLayers = mapLayers.filter(l => l.enabled).map(l => l.id).join('-');
    setMapSeed(`map-${selectedTimeframe}-${activeLayers}`);
    // console.log("Map updated. Timeframe:", selectedTimeframe, "Active Layers:", activeLayers);
  }, [mapLayers, selectedTimeframe]);

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
      description: `Map timeframe set to: ${value === "now" ? "Current" : value === "1hr" ? "Next 1 Hour (Forecast)" : "Next 12 Hours (Forecast)"}.`,
    });
  };

  const handleZoomToFit = () => {
    toast({ title: "Zoom to Fit", description: "Map zoomed to fit all relevant data. (Mock action)" });
    // In a real map, this would adjust the map's viewport
  };

  const handleApplyFilters = () => {
    // This button might not be strictly necessary if layers update instantly,
    // but kept for potential future complex filtering logic.
    const activeLayerNames = mapLayers.filter(l => l.enabled).map(l => l.name).join(', ');
    toast({
      title: "Map Filters Applied",
      description: `Displaying: ${activeLayerNames || 'No layers selected'}. Timeframe: ${selectedTimeframe}.`,
    });
  };

  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <MapPin className="h-8 w-8" />
          Interactive Congestion Map
        </h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[220px]"> {/* Increased width for longer text */}
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
          <Button variant="outline" size="icon" onClick={handleZoomToFit}>
            <ZoomIn className="h-4 w-4"/>
            <span className="sr-only">Zoom to Fit</span>
          </Button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-xl">
          <CardContent className="p-0 h-full">
            <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-0">
              <Image
                src={`https://picsum.photos/seed/${mapSeed}/1200/800`}
                alt="Interactive Map Placeholder"
                width={1200}
                height={800}
                className="object-cover w-full h-full"
                key={mapSeed} // Force re-render on seed change
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
                <Label htmlFor={layer.id} className="text-sm font-medium cursor-pointer">{layer.name}</Label>
                <Switch 
                  id={layer.id} 
                  checked={layer.enabled} 
                  onCheckedChange={(checked) => handleLayerToggle(layer.id, checked)}
                  aria-label={`Toggle ${layer.name}`} 
                />
              </div>
            ))}
             <Button className="w-full mt-4" onClick={handleApplyFilters}>Apply Layer Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
