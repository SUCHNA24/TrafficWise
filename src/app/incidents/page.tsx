
'use client';

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
import { AlertTriangle, Search, Filter, ListPlus, ArrowUpDown, CheckCircle, ArrowUpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link"; // Still useful for potential future dedicated detail pages
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


type Incident = { 
  id: string; 
  type: string; 
  location: string; 
  severity: "High" | "Medium" | "Low"; 
  status: "Active" | "Scheduled" | "Resolved" | "Pending"; 
  reportedAt: string; 
  description: string; 
  assignedTo?: string;
  resolutionNotes?: string;
};

const initialIncidents: Incident[] = [
  { id: "INC001", type: "Accident", location: "Main St & 1st Ave", severity: "High", status: "Active", reportedAt: "2024-07-28 10:15 AM", description: "Multi-vehicle collision, emergency services on scene.", assignedTo: "Team Alpha" },
  { id: "INC002", type: "Road Closure", location: "Oak Rd (btwn Pine & Elm)", severity: "Medium", status: "Scheduled", reportedAt: "2024-07-28 09:00 AM", description: "Roadworks planned from 1 PM to 5 PM." },
  { id: "INC003", type: "Weather Alert", location: "City Wide", severity: "Low", status: "Active", reportedAt: "2024-07-28 11:00 AM", description: "Heavy rain advisory, expect slippery roads." },
  { id: "INC004", type: "Traffic Jam", location: "Highway 101 Northbound", severity: "Medium", status: "Active", reportedAt: "2024-07-28 11:30 AM", description: "Congestion due to earlier incident.", assignedTo: "System" },
  { id: "INC005", type: "Accident", location: "Industrial Park Gate 2", severity: "Medium", status: "Resolved", reportedAt: "2024-07-27 08:00 AM", description: "Minor fender bender, cleared.", resolutionNotes: "Vehicles moved, traffic flowing." },
];

const getSeverityBadgeVariant = (severity: string): "destructive" | "secondary" | "default" | "outline" => {
  switch (severity.toLowerCase()) {
    case "high": return "destructive";
    case "medium": return "secondary"; 
    case "low": return "default"; 
    default: return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active": return "text-red-500";
    case "scheduled": return "text-blue-500";
    case "resolved": return "text-green-500";
    case "pending": return "text-yellow-500";
    default: return "text-muted-foreground";
  }
}

type SortKey = keyof Incident | '';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function IncidentReportsPage() {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>('reportedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [newIncidentData, setNewIncidentData] = useState<Partial<Incident>>({ type: "Accident", severity: "Medium", status: "Pending" });
  const [currentPage, setCurrentPage] = useState(1);


  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = incidents;
    if (searchTerm) {
      filtered = filtered.filter(inc => 
        Object.values(inc).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (filterType !== "all") {
      filtered = filtered.filter(inc => inc.type.toLowerCase().replace(/\s+/g, '_') === filterType);
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === undefined || valB === undefined) return 0;
        
        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        // Add more type comparisons if needed, e.g., for dates
        // For reportedAt, convert to Date for proper sorting if not already
        if (sortKey === 'reportedAt') {
            comparison = new Date(valA).getTime() - new Date(valB).getTime();
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    return filtered;
  }, [incidents, searchTerm, filterType, sortKey, sortOrder]);
  
  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedIncidents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedIncidents, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedIncidents.length / ITEMS_PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleResolveIncident = (incidentId: string, notes: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? {...inc, status: "Resolved", resolutionNotes: notes } : inc));
    setSelectedIncident(null); // Close dialog
    toast({ title: "Incident Resolved", description: `Incident ${incidentId} marked as resolved.`});
  };

  const handleEscalateIncident = (incidentId: string) => {
     toast({ title: "Incident Escalated", description: `Incident ${incidentId} has been escalated. (Mock action)`});
     // Potentially update status or assign to a higher tier team
  };

  const handleAddNewReport = () => {
    if (!newIncidentData.type || !newIncidentData.location || !newIncidentData.severity || !newIncidentData.description) {
      toast({ title: "Missing Information", description: "Please fill all required fields for the new report.", variant: "destructive" });
      return;
    }
    const newReport: Incident = {
      id: `INC${String(incidents.length + 1).padStart(3, '0')}`,
      type: newIncidentData.type!,
      location: newIncidentData.location!,
      severity: newIncidentData.severity as Incident["severity"],
      status: "Pending",
      reportedAt: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''),
      description: newIncidentData.description!,
    };
    setIncidents(prev => [newReport, ...prev]); // Add to top for visibility
    setIsNewReportModalOpen(false);
    setNewIncidentData({ type: "Accident", severity: "Medium", status: "Pending" }); // Reset form
    toast({ title: "New Incident Reported", description: `Incident ${newReport.id} has been created.` });
  };
  
  const handleNewReportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncidentData(prev => ({ ...prev, [name]: value }));
  };
   const handleNewReportSelectChange = (name: string, value: string) => {
    setNewIncidentData(prev => ({ ...prev, [name]: value }));
  };


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
            <Input 
              type="search" 
              placeholder="Search incidents..." 
              className="pl-8 w-full md:w-[200px] lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <Select value={filterType} onValueChange={(value) => { setFilterType(value); setCurrentPage(1);}}>
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
          <Button variant="outline" onClick={() => toast({title: "Advanced Filters", description: "Advanced filter dialog would appear here."})}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setIsNewReportModalOpen(true)}>
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
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort('id')}>
                    ID {sortKey === 'id' && <ArrowUpDown className="ml-2 h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort('type')}>
                    Type {sortKey === 'type' && <ArrowUpDown className="ml-2 h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                   <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort('severity')}>
                    Severity {sortKey === 'severity' && <ArrowUpDown className="ml-2 h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort('status')}>
                    Status {sortKey === 'status' && <ArrowUpDown className="ml-2 h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => handleSort('reportedAt')}>
                    Reported At {sortKey === 'reportedAt' && <ArrowUpDown className="ml-2 h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIncidents.map((incident) => (
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
                    <Button variant="link" size="sm" onClick={() => handleViewDetails(incident)} className="text-primary hover:underline">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardHeader className="flex flex-row items-center justify-between pt-4">
          <CardDescription>
            Showing {paginatedIncidents.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedIncidents.length)} of {filteredAndSortedIncidents.length} incidents.
          </CardDescription>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
          </div>
        </CardHeader>
      </Card>

      {/* Incident Details Dialog */}
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Incident Details: {selectedIncident.id}</DialogTitle>
              <DialogDescription>
                Type: {selectedIncident.type} | Severity: <Badge variant={getSeverityBadgeVariant(selectedIncident.severity)}>{selectedIncident.severity}</Badge> | Status: <span className={getStatusColor(selectedIncident.status)}>{selectedIncident.status}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <p><strong>Location:</strong> {selectedIncident.location}</p>
              <p><strong>Reported At:</strong> {selectedIncident.reportedAt}</p>
              <p><strong>Description:</strong> {selectedIncident.description}</p>
              {selectedIncident.assignedTo && <p><strong>Assigned To:</strong> {selectedIncident.assignedTo}</p>}
              {selectedIncident.status === "Resolved" && selectedIncident.resolutionNotes && (
                 <p><strong>Resolution Notes:</strong> {selectedIncident.resolutionNotes}</p>
              )}

              {selectedIncident.status === "Active" && (
                <>
                <Label htmlFor="resolutionNotes">Resolution Notes (if resolving):</Label>
                <Textarea id="resolutionNotes" name="resolutionNotes" placeholder="Enter resolution details..."/>
                </>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
                {selectedIncident.status === "Active" && (
                    <Button variant="outline" onClick={() => handleEscalateIncident(selectedIncident.id)}>
                        <ArrowUpCircle className="mr-2 h-4 w-4"/> Escalate
                    </Button>
                )}
                <div>
                    <DialogClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                    {selectedIncident.status === "Active" && (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="ml-2">
                                    <CheckCircle className="mr-2 h-4 w-4"/> Mark as Resolved
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Resolution</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to mark incident {selectedIncident.id} as resolved? Please ensure resolution notes are added if necessary.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleResolveIncident(selectedIncident.id, (document.getElementById('resolutionNotes') as HTMLTextAreaElement)?.value || '')}>Confirm Resolve</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Incident Report Dialog */}
      <Dialog open={isNewReportModalOpen} onOpenChange={setIsNewReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report New Incident</DialogTitle>
            <DialogDescription>Fill in the details for the new incident.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="newIncidentType">Type</Label>
              <Select name="type" value={newIncidentData.type} onValueChange={(value) => handleNewReportSelectChange("type", value)}>
                <SelectTrigger id="newIncidentType"><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accident">Accident</SelectItem>
                  <SelectItem value="Road Closure">Road Closure</SelectItem>
                  <SelectItem value="Weather Alert">Weather Alert</SelectItem>
                  <SelectItem value="Traffic Jam">Traffic Jam</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newIncidentLocation">Location</Label>
              <Input id="newIncidentLocation" name="location" value={newIncidentData.location || ""} onChange={handleNewReportInputChange} placeholder="e.g., Main St & 1st Ave" />
            </div>
            <div>
              <Label htmlFor="newIncidentSeverity">Severity</Label>
               <Select name="severity" value={newIncidentData.severity} onValueChange={(value) => handleNewReportSelectChange("severity", value)}>
                <SelectTrigger id="newIncidentSeverity"><SelectValue placeholder="Select severity..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newIncidentDescription">Description</Label>
              <Textarea id="newIncidentDescription" name="description" value={newIncidentData.description || ""} onChange={handleNewReportInputChange} placeholder="Describe the incident..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddNewReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
