import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Video, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const cameraLocations = [
  { id: 1, name: "Main St & 1st Ave", area: "Downtown", status: "Online", vehicles: 12 },
  { id: 2, name: "Oak Rd & Pine Ln", area: "Suburb", status: "Online", vehicles: 7 },
  { id: 3, name: "Highway 101 Exit 5", area: "Highway", status: "Online", vehicles: 23 },
  { id: 4, name: "Industrial Park Gate 2", area: "Industrial", status: "Offline", vehicles: 0 },
  { id: 5, name: "City Center Plaza", area: "Downtown", status: "Online", vehicles: 18 },
  { id: 6, name: "Residential Block A", area: "Suburb", status: "Maintenance", vehicles: 3 },
];

export default function CameraFeedsPage() {
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
            <Input type="search" placeholder="Search feeds..." className="pl-8 w-full md:w-[200px] lg:w-[300px]" />
          </div>
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="suburb">Suburb</SelectItem>
              <SelectItem value="highway">Highway</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4"/>
            <span className="sr-only">More Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameraLocations.map((cam) => (
          <Card key={cam.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{cam.name}</CardTitle>
              <CardDescription>{cam.area} - <span className={
                cam.status === "Online" ? "text-green-600" : 
                cam.status === "Offline" ? "text-destructive" : "text-yellow-500"
              }>{cam.status}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                <Image
                  src={`https://picsum.photos/seed/cam${cam.id}/640/360`}
                  alt={`Live Camera Feed ${cam.id} - ${cam.name}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="traffic surveillance"
                  className={cam.status !== "Online" ? "grayscale opacity-50" : ""}
                />
                {cam.status !== "Online" && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <p className="text-white text-xl font-semibold">{cam.status}</p>
                  </div>
                )}
                {cam.status === "Online" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent p-2 flex flex-col justify-end">
                     <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full">
                      LIVE
                    </div>
                  </div>
                )}
              </div>
              {cam.status === "Online" && (
                <div className="flex justify-between items-center text-sm">
                  <p>Vehicles Detected: <span className="font-semibold text-primary">{cam.vehicles}</span></p>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              )}
               {cam.status !== "Online" && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <p>Last online: {cam.id % 2 === 0 ? '2 hours ago' : '1 day ago'}</p>
                   <Button variant="ghost" size="sm" disabled>View Details</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
