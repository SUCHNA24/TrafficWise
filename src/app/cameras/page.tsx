
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Video, Search, Filter, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const initialCameraLocations = [
  { id: 1, name: "Main St & 1st Ave", area: "Downtown", status: "Online", vehicles: 12, imageUrlSeed: "cam1" },
  { id: 2, name: "Oak Rd & Pine Ln", area: "Suburb", status: "Online", vehicles: 7, imageUrlSeed: "cam2" },
  { id: 3, name: "Highway 101 Exit 5", area: "Highway", status: "Online", vehicles: 23, imageUrlSeed: "cam3" },
  { id: 4, name: "Industrial Park Gate 2", area: "Industrial", status: "Offline", vehicles: 0, imageUrlSeed: "cam4" },
  { id: 5, name: "City Center Plaza", area: "Downtown", status: "Online", vehicles: 18, imageUrlSeed: "cam5" },
  { id: 6, name: "Residential Block A", area: "Suburb", status: "Maintenance", vehicles: 3, imageUrlSeed: "cam6" },
];

type CameraLocation = typeof initialCameraLocations[0];

export default function CameraFeedsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [filteredCameras, setFilteredCameras] = useState<CameraLocation[]>(initialCameraLocations);
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let cameras = initialCameraLocations;
    if (searchTerm) {
      cameras = cameras.filter(cam => cam.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedArea !== "all") {
      cameras = cameras.filter(cam => cam.area.toLowerCase() === selectedArea.toLowerCase());
    }
    setFilteredCameras(cameras);
  }, [searchTerm, selectedArea]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAreaFilterChange = (value: string) => {
    setSelectedArea(value);
  };

  const handleMoreFilters = () => {
    toast({ title: "More Filters", description: "Advanced filter options would appear here." });
  };

  const handleViewDetails = (cam: CameraLocation) => {
    if (cam.status === "Online") {
      setSelectedCamera(cam);
      setIsDialogOpen(true);
    } else {
      toast({
        title: "Camera Offline",
        description: `Camera ${cam.name} is currently ${cam.status.toLowerCase()}. Details are not available.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Video className="h-8 w-8" />
          Live Camera Feeds
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search feeds..." 
              className="pl-8 w-full md:w-[200px] lg:w-[300px]" 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select value={selectedArea} onValueChange={handleAreaFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Downtown">Downtown</SelectItem>
              <SelectItem value="Suburb">Suburb</SelectItem>
              <SelectItem value="Highway">Highway</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleMoreFilters}>
            <Filter className="h-4 w-4"/>
            <span className="sr-only">More Filters</span>
          </Button>
        </div>
      </div>

      {filteredCameras.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg col-span-full">No cameras match your current filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map((cam) => (
            <Dialog key={cam.id} open={selectedCamera?.id === cam.id && isDialogOpen} onOpenChange={(isOpen) => {
              if (!isOpen) {
                setIsDialogOpen(false);
                // setSelectedCamera(null); // Let Dialog close naturally, then if needed on next open it will set new cam
              }
            }}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{cam.name}</CardTitle>
                  <CardDescription>{cam.area} - <span className={
                    cam.status === "Online" ? "text-green-600" : 
                    cam.status === "Offline" ? "text-destructive" : "text-yellow-500"
                  }>{cam.status}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <button 
                      className="relative aspect-video rounded-md overflow-hidden mb-3 w-full cursor-pointer group"
                      onClick={() => handleViewDetails(cam)}
                      disabled={cam.status !== "Online"}
                      aria-label={`View details for ${cam.name}`}
                    >
                      <Image
                        src={`https://picsum.photos/seed/${cam.imageUrlSeed}/640/360`}
                        alt={`Live Camera Feed ${cam.id} - ${cam.name}`}
                        fill // Changed from layout="fill" to fill for Next 13+
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Added sizes prop
                        style={{objectFit:"cover"}} // Changed from objectFit="cover" to style
                        data-ai-hint="traffic surveillance"
                        className={cam.status !== "Online" ? "grayscale opacity-50" : "group-hover:scale-105 transition-transform duration-300"}
                      />
                      {cam.status !== "Online" && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <p className="text-white text-xl font-semibold">{cam.status}</p>
                        </div>
                      )}
                      {cam.status === "Online" && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full">
                            LIVE
                          </div>
                           <p className="text-white text-sm font-medium">Click to view details</p>
                        </div>
                      )}
                    </button>
                  {cam.status === "Online" && (
                    <div className="flex justify-between items-center text-sm">
                      <p>Vehicles Detected: <span className="font-semibold text-primary">{cam.vehicles}</span></p>
                       <Button variant="ghost" size="sm" onClick={() => handleViewDetails(cam)}>View Details</Button>
                    </div>
                  )}
                  {cam.status !== "Online" && (
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <p>Last online: {cam.id % 2 === 0 ? '2 hours ago' : '1 day ago'}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(cam)} disabled={cam.status !== 'Online'}>View Details</Button>
                    </div>
                  )}
                </CardContent>
                 
                  <DialogContent className="sm:max-w-[600px]">
                    {selectedCamera && ( // Ensure selectedCamera is not null before rendering
                    <>
                      <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedCamera.name}</DialogTitle>
                      <DialogDescription>
                          Area: {selectedCamera.area} | Status: <span className={
                          selectedCamera.status === "Online" ? "text-green-600" : 
                          selectedCamera.status === "Offline" ? "text-destructive" : "text-yellow-500"
                          }>{selectedCamera.status}</span>
                          {selectedCamera.status === "Online" && ` | Vehicles: ${selectedCamera.vehicles}`}
                      </DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-video rounded-md overflow-hidden my-4">
                      <Image
                          src={`https://picsum.photos/seed/${selectedCamera.imageUrlSeed}/1280/720`} // Larger image for dialog
                          alt={`Enlarged view of ${selectedCamera.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 600px"
                          style={{objectFit:"contain"}}
                          data-ai-hint="detailed traffic"
                      />
                       {selectedCamera.status === "Online" && (
                          <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full">LIVE</div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                      This is a detailed view of the camera feed. In a real application, you might see more controls, historical data, or AI insights here.
                      </p>
                      <Button className="mt-4 w-full" onClick={() => {
                        toast({title: "External Feed", description: `Opening external feed for ${selectedCamera.name}`});
                        // window.open(`your-external-feed-url/${selectedCamera.id}`, "_blank");
                      }}>
                        <ExternalLink className="mr-2 h-4 w-4"/> Open Full Feed in New Tab (Mock)
                      </Button>
                      </>
                      )}
                  </DialogContent>
              </Card>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}

