
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
import { cn } from "@/lib/utils";


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
    toast({ title: "Advanced Filters Applied", description: "Additional filtering options would be available here (e.g., by resolution, maintenance date). Currently showing all." });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Online": return <Badge variant="default" className="bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-400 border-green-500/30 shadow-sm hover:shadow-md transition-shadow"><CheckCircle2 className="mr-1 h-3 w-3" />Online</Badge>;
      case "Offline": return <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-400 border-red-500/30 shadow-sm hover:shadow-md transition-shadow"><AlertCircle className="mr-1 h-3 w-3" />Offline</Badge>;
      case "Maintenance": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400 border-yellow-500/30 shadow-sm hover:shadow-md transition-shadow"><Settings2 className="mr-1 h-3 w-3" />Maintenance</Badge>;
      default: return <Badge variant="outline" className="shadow-sm hover:shadow-md transition-shadow">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
       <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-primary flex items-center justify-center gap-4 mb-2">
          <Video className="h-12 w-12" />
          Live Camera Feeds
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Monitor real-time traffic conditions with AI-enhanced surveillance across strategic city locations.
        </p>
      </header>

      <Card className="mb-8 shadow-xl rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by name, area..." 
                className="pl-12 pr-4 py-3 w-full text-base rounded-lg shadow-inner focus:ring-2 focus:ring-primary" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full md:w-[200px] py-3 text-base rounded-lg shadow-sm focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="Suburb">Suburb</SelectItem>
                <SelectItem value="Highway">Highway</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] py-3 text-base rounded-lg shadow-sm focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleAdvancedFilters} className="w-full md:w-auto py-3 text-base rounded-lg shadow-sm hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary">
              <Filter className="mr-2 h-5 w-5"/> Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredCameras.length === 0 ? (
        <Card className="shadow-xl rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
                <Video className="h-20 w-20 mx-auto mb-6 text-primary/40"/>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">No Cameras Found</h3>
                <p className="max-w-md">Your search or filter criteria did not match any camera locations. Please try adjusting your selections or broadening your search.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
          {filteredCameras.map((cam) => (
            <Dialog key={cam.id} open={selectedCamera?.id === cam.id && isDialogOpen} onOpenChange={(isOpen) => {
              if (!isOpen) {
                 setIsDialogOpen(false);
                 setSelectedCamera(null); 
              }
            }}>
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1.5 flex flex-col bg-card/80 backdrop-blur-sm transform hover:scale-105">
                <DialogTrigger asChild disabled={cam.status !== "Online"}>
                  <button 
                    className="relative aspect-[16/10] w-full group cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-xl"
                    onClick={() => { if (cam.status === "Online") { setSelectedCamera(cam); setIsDialogOpen(true); } else {
                       toast({
                            title: `Camera ${cam.status}`,
                            description: `${cam.name} is currently ${cam.status.toLowerCase()}. Live feed not available.`,
                            variant: cam.status === "Offline" ? "destructive" : "default",
                          });
                    } }}
                    aria-label={`View details for ${cam.name}`}
                    disabled={cam.status !== "Online"}
                  >
                    <Image
                      src={`https://picsum.photos/seed/${cam.imageUrlSeed}/640/400`}
                      alt={`Live Camera Feed ${cam.id} - ${cam.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{objectFit:"cover"}}
                      data-ai-hint="traffic surveillance"
                      className={cn(
                        "transition-all duration-300 rounded-t-xl",
                        cam.status !== "Online" ? "grayscale opacity-50" : "group-hover:scale-105 group-hover:brightness-110"
                      )}
                    />
                    {cam.status !== "Online" && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-t-xl">
                        {getStatusBadge(cam.status)}
                      </div>
                    )}
                     {cam.status === "Online" && (
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 p-3 flex flex-col justify-between rounded-t-xl">
                          <div className="self-end">{getStatusBadge(cam.status)}</div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Eye className="h-12 w-12 text-white/80 drop-shadow-lg" />
                          </div>
                          <div></div> {/* For spacing */}
                       </div>
                    )}
                  </button>
                </DialogTrigger>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-md font-semibold truncate" title={cam.name}>{cam.name}</CardTitle>
                  <CardDescription className="text-xs">{cam.area}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-3 flex-grow">
                  {cam.status === "Online" && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Vehicles: <span className="font-bold text-primary">{cam.vehicles}</span></p>
                      <p className="text-muted-foreground">Res: <span className="font-semibold text-foreground">{cam.resolution}</span></p>
                    </div>
                  )}
                  {cam.status !== "Online" && (
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>Last online: {cam.id % 2 === 0 ? 'Approx. 2 hours ago' : 'Yesterday'}</p>
                      <p>Next Maint.: {new Date(cam.lastMaintenance).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  )}
                </CardContent>
                 <CardFooter className="p-3 border-t bg-muted/20 rounded-b-xl">
                    <Button 
                      variant={cam.status === "Online" ? "default" : "outline"}
                      size="sm" 
                      className="w-full font-semibold text-sm hover:shadow-md transition-shadow" 
                      onClick={() => {
                        if (cam.status === "Online") {
                          setSelectedCamera(cam);
                          setIsDialogOpen(true);
                        } else {
                          toast({
                            title: `Camera ${cam.status}`,
                            description: `${cam.name} is currently ${cam.status.toLowerCase()}. Detailed view unavailable.`,
                            variant: cam.status === "Offline" ? "destructive" : "default",
                            duration: 4000,
                          });
                        }
                      }}
                    >
                      {cam.status === "Online" ? <><Eye className="mr-2 h-4 w-4"/>View Details</> : "Show Info"}
                    </Button>
                 </CardFooter>
                  <DialogContent className="sm:max-w-3xl p-0 rounded-xl shadow-2xl">
                    {selectedCamera && (
                    <>
                      <DialogHeader className="p-6 pb-4 border-b bg-card rounded-t-xl">
                        <DialogTitle className="text-2xl font-bold text-primary">{selectedCamera.name}</DialogTitle>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                            <span>Area: <span className="font-medium text-foreground">{selectedCamera.area}</span></span>
                            <span className="text-muted-foreground/50">|</span>
                            {getStatusBadge(selectedCamera.status)}
                            {selectedCamera.status === "Online" && <> <span className="text-muted-foreground/50">|</span> <span>Vehicles: <span className="font-medium text-foreground">{selectedCamera.vehicles}</span></span> </>}
                             <span className="text-muted-foreground/50">|</span>
                            <span>Resolution: <span className="font-medium text-foreground">{selectedCamera.resolution}</span></span>
                        </div>
                      </DialogHeader>
                      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl border border-border">
                        <Image
                            src={`https://picsum.photos/seed/${selectedCamera.imageUrlSeed}/1280/720`}
                            alt={`Enlarged view of ${selectedCamera.name}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            style={{objectFit:"cover"}}
                            data-ai-hint="detailed traffic"
                            className="rounded-lg"
                        />
                        {selectedCamera.status === "Online" && (
                            <Badge variant="default" className="absolute top-4 right-4 bg-primary/90 text-primary-foreground shadow-lg text-sm px-3 py-1">LIVE</Badge>
                          )}
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          This is a detailed, high-resolution view of the camera feed from <span className="font-semibold text-primary">{selectedCamera.name}</span>. In a fully operational system, this panel would include interactive controls, AI-driven object detection overlays (highlighting vehicles, pedestrians, etc.), and potentially a timeline for reviewing recent events or footage.
                        </p>
                        <p className="text-sm text-muted-foreground">Last Maintenance Check: {new Date(selectedCamera.lastMaintenance).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                      </div>
                      <DialogFooter className="p-6 pt-4 border-t bg-muted/30 sm:justify-between rounded-b-xl">
                          <DialogClose asChild>
                            <Button variant="outline" className="font-semibold">Close</Button>
                          </DialogClose>
                          <Button onClick={() => {
                            toast({title: "Opening External Feed", description: `Attempting to open full feed for ${selectedCamera.name}. This is a mock action.`});
                          }} className="font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
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

