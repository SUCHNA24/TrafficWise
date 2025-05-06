import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Filter, ListPlus, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const incidents = [
  { id: "INC001", type: "Accident", location: "Main St & 1st Ave", severity: "High", status: "Active", reportedAt: "2024-07-28 10:15 AM", description: "Multi-vehicle collision, emergency services on scene." },
  { id: "INC002", type: "Road Closure", location: "Oak Rd (btwn Pine & Elm)", severity: "Medium", status: "Scheduled", reportedAt: "2024-07-28 09:00 AM", description: "Roadworks planned from 1 PM to 5 PM." },
  { id: "INC003", type: "Weather Alert", location: "City Wide", severity: "Low", status: "Active", reportedAt: "2024-07-28 11:00 AM", description: "Heavy rain advisory, expect slippery roads." },
  { id: "INC004", type: "Traffic Jam", location: "Highway 101 Northbound", severity: "Medium", status: "Active", reportedAt: "2024-07-28 11:30 AM", description: "Congestion due to earlier incident." },
  { id: "INC005", type: "Accident", location: "Industrial Park Gate 2", severity: "Medium", status: "Resolved", reportedAt: "2024-07-27 08:00 AM", description: "Minor fender bender, cleared." },
];

const getSeverityBadgeVariant = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "high": return "destructive";
    case "medium": return "secondary"; // Or a custom yellow/orange
    case "low": return "default"; // Or a custom green/blue
    default: return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active": return "text-red-500";
    case "scheduled": return "text-blue-500";
    case "resolved": return "text-green-500";
    default: return "text-muted-foreground";
  }
}


export default function IncidentReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <AlertTriangle className="h-8 w-8" />
          Incident Reports
        </h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search incidents..." className="pl-8 w-full md:w-[200px] lg:w-[250px]" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="accident">Accident</SelectItem>
              <SelectItem value="road_closure">Road Closure</SelectItem>
              <SelectItem value="weather_alert">Weather Alert</SelectItem>
              <SelectItem value="traffic_jam">Traffic Jam</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <ListPlus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                    ID <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                    Type <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                    Status <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                    Reported At <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(incident.status)}`}>{incident.status}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{incident.reportedAt}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" asChild className="text-primary hover:underline">
                      <Link href={`/incidents/${incident.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between pt-4">
          <CardDescription>
            Showing 1 to {incidents.length} of {incidents.length} incidents.
          </CardDescription>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={true}>Previous</Button>
            <Button variant="outline" size="sm" disabled={true}>Next</Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
