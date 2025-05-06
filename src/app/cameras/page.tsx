
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Video, Search, Filter, ExternalLink, Eye, AlertCircle, CheckCircle2, Settings2 } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


const initialCameraLocations = [
  { id: 1, name: "Main St & 1st Ave", area: "Downtown", status: "Online", vehicles: 12, imageUrlSeed: "cam1", resolution: "1080p", lastMaintenance: "2024-07-15" },
  { id: 2, name: "Oak Rd & Pine Ln", area: "Suburb", status: "Online", vehicles: 7, imageUrlSeed: "cam2", resolution: "720p", lastMaintenance: "2024-06-20" },
  { id: 3, name: "Highway 101 Exit 5", area: "Highway", status: "Online", vehicles: 23, imageUrlSeed: "cam3", resolution: "4K", lastMaintenance: "2024-07-01" },
  { id: 4, name: "Industrial Park Gate 2", area: "Industrial", status: "Offline", vehicles: 0, imageUrlSeed: "cam4", resolution: "1080p", lastMaintenance: "2024-05-10" },
  { id: 5, name: "City Center Plaza", area: "Downtown", status: "Online", vehicles: 18, imageUrlSeed: "cam5", resolution: "1080p", lastMaintenance: "2024-07-22" },
  { id: 6, name: "Residential Block A", area: "Suburb", status: "Maintenance", vehicles: 3, imageUrlSeed: "cam6", resolution: "720p", lastMaintenance: "2024-07-28" },
];

type CameraLocation = typeof initialCameraLocations[0];

export default function CameraFeedsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredCameras, setFilteredCameras] = useState<CameraLocation[]>(initialCameraLocations);
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let cameras = initialCameraLocations;
    if (searchTerm) {
      cameras = cameras.filter(cam => cam.name.toLowerCase().includes(searchTerm.toLowerCase()) || cam.area.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedArea !== "all") {
      cameras = cameras.filter(cam => cam.area.toLowerCase() === selectedArea.toLowerCase());
    }
    if (selectedStatus !== "all") {
      cameras = cameras.filter(cam => cam.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    setFilteredCameras(cameras);
  }, [searchTerm, selectedArea, selectedStatus]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAdvancedFilters = () => {
    toast({ title: "Advanced Filters", description: "More filter options (e.g., resolution, last maintenance) would appear in a dedicated dialog or sidebar." });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Online": return <Badge variant="default" className="bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-400 border-green-500/30"><CheckCircle2 className="mr-1 h-3 w-3" />Online</Badge>;
      case "Offline": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-400 border-red-500/30"><AlertCircle className="mr-1 h-3 w-3" />Offline</Badge>;
      case "Maintenance": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400 border-yellow-500/30"><Settings2 className="mr-1 h-3 w-3" />Maintenance</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
       <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <Video className="h-10 w-10" />
          Live Camera Feeds
        </h1>
        <p className="text-muted-foreground mt-1">Monitor real-time traffic conditions across the city.</p>
      </header>

      <Card className="mb-8 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by name or area..." 
                className="pl-10 w-full" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full md:w-[180px]">
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleAdvancedFilters} className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4"/> More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredCameras.length === 0 ? (
        <Card className="shadow-lg">
            <CardContent className="p-10 text-center text-muted-foreground">
                <Video className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                <h3 className="text-xl font-semibold mb-2">No Cameras Found</h3>
                <p>No cameras match your current filter criteria. Try adjusting your search or filters.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCameras.map((cam) => (
            <Dialog key={cam.id} open={selectedCamera?.id === cam.id && isDialogOpen} onOpenChange={(isOpen) => {
              if (!isOpen) {
                 setIsDialogOpen(false);
                 setSelectedCamera(null); 
              }
            }}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col">
                <DialogTrigger asChild disabled={cam.status !== "Online"}>
                  <button 
                    className="relative aspect-video w-full group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-lg"
                    onClick={() => { if (cam.status === "Online") { setSelectedCamera(cam); setIsDialogOpen(true); } }}
                    aria-label={`View details for ${cam.name}`}
                    disabled={cam.status !== "Online"}
                  >
                    <Image
                      src={`https://picsum.photos/seed/${cam.imageUrlSeed}/640/360`}
                      alt={`Live Camera Feed ${cam.id} - ${cam.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{objectFit:"cover"}}
                      data-ai-hint="traffic surveillance"
                      className={cn(
                        "transition-transform duration-300",
                        cam.status !== "Online" ? "grayscale opacity-60" : "group-hover:scale-105"
                      )}
                    />
                    {cam.status !== "Online" && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        {getStatusBadge(cam.status)}
                      </div>
                    )}
                     {cam.status === "Online" && (
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 p-3 flex flex-col justify-between">
                          <div className="self-end">{getStatusBadge(cam.status)}</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-center">
                              <Eye className="h-10 w-10 text-white/80" />
                          </div>
                          <div></div> {/* For spacing */}
                       </div>
                    )}
                  </button>
                </DialogTrigger>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base font-semibold truncate" title={cam.name}>{cam.name}</CardTitle>
                  <CardDescription className="text-xs">{cam.area}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-3 flex-grow">
                  {cam.status === "Online" && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Vehicles: <span className="font-semibold text-primary">{cam.vehicles}</span></p>
                      <p className="text-muted-foreground">Res: <span className="font-semibold text-foreground">{cam.resolution}</span></p>
                    </div>
                  )}
                  {cam.status !== "Online" && (
                    <div className="text-sm text-muted-foreground">
                      <p>Last online: {cam.id % 2 === 0 ? '2 hours ago' : '1 day ago'}</p>
                      <p>Last Maintenance: {cam.lastMaintenance}</p>
                    </div>
                  )}
                </CardContent>
                 <CardFooter className="p-2 border-t bg-muted/30">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-primary hover:text-primary/90" 
                      onClick={() => {
                        if (cam.status === "Online") {
                          setSelectedCamera(cam);
                          setIsDialogOpen(true);
                        } else {
                          toast({
                            title: "Camera Offline",
                            description: `Camera ${cam.name} is currently ${cam.status.toLowerCase()}. Live details are not available.`,
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      {cam.status === "Online" ? "View Details" : "Show Info"}
                    </Button>
                 </CardFooter>
                  <DialogContent className="sm:max-w-2xl p-0">
                    {selectedCamera && (
                    <>
                      <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-2xl">{selectedCamera.name}</DialogTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Area: {selectedCamera.area}</span>
                            <span>|</span>
                            {getStatusBadge(selectedCamera.status)}
                            {selectedCamera.status === "Online" && <span>| Vehicles: {selectedCamera.vehicles}</span>}
                            <span>| Resolution: {selectedCamera.resolution}</span>
                        </div>
                      </DialogHeader>
                      <div className="p-6 space-y-4">
                        <div className="relative aspect-video rounded-md overflow-hidden shadow-lg">
                        <Image
                            src={`https://picsum.photos/seed/${selectedCamera.imageUrlSeed}/1280/720`}
                            alt={`Enlarged view of ${selectedCamera.name}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            style={{objectFit:"cover"}}
                            data-ai-hint="detailed traffic"
                        />
                        {selectedCamera.status === "Online" && (
                            <Badge variant="default" className="absolute top-3 right-3 bg-primary/80 text-primary-foreground">LIVE</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This is a detailed view of the camera feed from <span className="font-semibold text-foreground">{selectedCamera.name}</span>. In a real application, you might see more controls, historical data, AI-driven object detection overlays, or event timelines here.
                        </p>
                        <p className="text-xs text-muted-foreground">Last Maintenance: {selectedCamera.lastMaintenance}</p>
                      </div>
                      <DialogFooter className="p-6 pt-4 border-t bg-muted/30 sm:justify-between">
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                          <Button onClick={() => {
                            toast({title: "Opening External Feed", description: `Attempting to open full feed for ${selectedCamera.name}.`});
                            // window.open(`your-external-feed-url/${selectedCamera.id}`, "_blank");
                          }}>
                            <ExternalLink className="mr-2 h-4 w-4"/> Open Full Feed (Mock)
                          </Button>
                      </DialogFooter>
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
