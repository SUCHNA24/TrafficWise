
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertTriangle, Search, Filter, ListPlus, ArrowUpDown, CheckCircle, ArrowUpCircle, Eye, Edit, Trash2, MoreVertical, PackageSearch } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


type Incident = { 
  id: string; 
  type: string; 
  location: string; 
  severity: "Critical" | "High" | "Medium" | "Low"; 
  status: "Active" | "Investigating" | "Monitoring" | "Scheduled" | "Resolved" | "Closed"; 
  reportedAt: string; 
  description: string; 
  assignedTo?: string;
  resolutionNotes?: string;
  updatedAt: string;
};

const initialIncidents: Incident[] = [
  { id: "INC001", type: "Major Accident", location: "Main St & 1st Ave", severity: "Critical", status: "Active", reportedAt: "2024-07-28 10:15", description: "Multi-vehicle collision, emergency services on scene. Heavy traffic impact.", assignedTo: "Team Alpha", updatedAt: "2024-07-28 11:30" },
  { id: "INC002", type: "Road Closure", location: "Oak Rd (btwn Pine & Elm)", severity: "Medium", status: "Scheduled", reportedAt: "2024-07-28 09:00", description: "Roadworks planned from 13:00 to 17:00.", updatedAt: "2024-07-28 09:05" },
  { id: "INC003", type: "Weather Alert", location: "City Wide", severity: "Low", status: "Monitoring", reportedAt: "2024-07-28 11:00", description: "Heavy rain advisory, expect slippery roads. No major disruptions yet.", updatedAt: "2024-07-28 12:00" },
  { id: "INC004", type: "Traffic Jam", location: "Highway 101 Northbound", severity: "High", status: "Active", reportedAt: "2024-07-28 11:30", description: "Congestion due to earlier incident INC001. Extended delays.", assignedTo: "System", updatedAt: "2024-07-28 12:15" },
  { id: "INC005", type: "Minor Accident", location: "Industrial Park Gate 2", severity: "Medium", status: "Resolved", reportedAt: "2024-07-27 08:00", description: "Minor fender bender, cleared by operator.", resolutionNotes: "Vehicles moved, traffic flowing normally.", updatedAt: "2024-07-27 08:45" },
  { id: "INC006", type: "Signal Malfunction", location: "Park Ave & Lake Rd", severity: "High", status: "Investigating", reportedAt: "2024-07-28 12:30", description: "Traffic signals reported as offline. Technician dispatched.", assignedTo: "Team Bravo", updatedAt: "2024-07-28 12:35"},
];

const getSeverityBadgeDetails = (severity: Incident["severity"]): { variant: "destructive" | "secondary" | "default" | "outline"; className: string } => {
  switch (severity) {
    case "Critical": return { variant: "destructive", className: "bg-red-600 hover:bg-red-700 text-white border-red-700" };
    case "High": return { variant: "destructive", className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-600" };
    case "Medium": return { variant: "secondary", className: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500" };
    case "Low": return { variant: "default", className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600" };
    default: return { variant: "outline", className: "" };
  }
};

const getStatusBadgeDetails = (status: Incident["status"]): { className: string; icon?: React.ReactNode } => {
  switch (status) {
    case "Active": return { className: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-400 dark:border-red-700", icon: <AlertTriangle className="mr-1 h-3 w-3" /> };
    case "Investigating": return { className: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-400 dark:border-yellow-700", icon: <Search className="mr-1 h-3 w-3" /> };
    case "Monitoring": return { className: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-700", icon: <Eye className="mr-1 h-3 w-3" /> };
    case "Scheduled": return { className: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-400 dark:border-purple-700" };
    case "Resolved": return { className: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700", icon: <CheckCircle className="mr-1 h-3 w-3" /> };
    case "Closed": return { className: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600" };
    default: return { className: "bg-muted text-muted-foreground border-border" };
  }
}

type SortKey = keyof Incident | '';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 8;

export default function IncidentReportsPage() {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>('reportedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);
  const [formValues, setFormValues] = useState<Partial<Incident>>({ type: "Accident", severity: "Medium" });
  const [currentPage, setCurrentPage] = useState(1);


  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = incidents;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(inc => 
        inc.id.toLowerCase().includes(lowerSearchTerm) ||
        inc.type.toLowerCase().includes(lowerSearchTerm) ||
        inc.location.toLowerCase().includes(lowerSearchTerm) ||
        inc.description.toLowerCase().includes(lowerSearchTerm) ||
        (inc.assignedTo && inc.assignedTo.toLowerCase().includes(lowerSearchTerm))
      );
    }
    if (filterType !== "all") {
      filtered = filtered.filter(inc => inc.type.toLowerCase().replace(/\s+/g, '_') === filterType);
    }
    if (filterSeverity !== "all") {
      filtered = filtered.filter(inc => inc.severity.toLowerCase() === filterSeverity);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(inc => inc.status.toLowerCase() === filterStatus);
    }


    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === undefined || valB === undefined) return 0;
        
        let comparison = 0;
        if (sortKey === 'reportedAt' || sortKey === 'updatedAt') {
            comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    return filtered;
  }, [incidents, searchTerm, filterType, filterSeverity, filterStatus, sortKey, sortOrder]);
  
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
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? {...inc, status: "Resolved", resolutionNotes: notes, updatedAt: new Date().toISOString().slice(0,16).replace('T', ' ') } : inc));
    setSelectedIncident(prev => prev && prev.id === incidentId ? {...prev, status: "Resolved", resolutionNotes: notes, updatedAt: new Date().toISOString().slice(0,16).replace('T', ' ')} : prev); // Update selectedIncident if it's the one being resolved
    toast({ title: "Incident Resolved", description: `Incident ${incidentId} marked as resolved.`, className: "bg-green-500 text-white dark:bg-green-600" });
  };

  const handleEscalateIncident = (incident: Incident) => {
     setIncidents(prev => prev.map(inc => inc.id === incident.id ? {...inc, severity: "Critical", status: "Active", assignedTo: "Escalation Team", updatedAt: new Date().toISOString().slice(0,16).replace('T', ' ') } : inc));
     setSelectedIncident(prev => prev && prev.id === incident.id ? {...prev, severity: "Critical", status: "Active", assignedTo: "Escalation Team", updatedAt: new Date().toISOString().slice(0,16).replace('T', ' ') } : prev);
     toast({ title: "Incident Escalated", description: `Incident ${incident.id} escalated to Critical.`, variant: "destructive"});
  };

  const handleOpenNewReportModal = () => {
    setFormValues({ type: "Accident", severity: "Medium" });
    setIsNewReportModalOpen(true);
  };

  const handleOpenEditReportModal = (incident: Incident) => {
    setIncidentToEdit(incident);
    setFormValues(incident);
    setIsEditReportModalOpen(true);
  };
  
  const handleDeleteIncident = (incidentId: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== incidentId));
    setSelectedIncident(null);
    toast({ title: "Incident Deleted", description: `Incident ${incidentId} has been deleted.`, variant: "destructive"});
  };


  const handleFormSubmit = () => {
    if (!formValues.type || !formValues.location || !formValues.severity || !formValues.description) {
      toast({ title: "Missing Information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const now = new Date().toISOString().slice(0,16).replace('T', ' ');

    if (incidentToEdit) { // Editing existing incident
      const updatedIncident: Incident = {
        ...incidentToEdit,
        ...formValues,
        updatedAt: now,
      } as Incident; // Ensure all required fields are present
      setIncidents(prev => prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc));
      toast({ title: "Incident Updated", description: `Incident ${updatedIncident.id} has been updated.` });
      setIsEditReportModalOpen(false);
      setIncidentToEdit(null);
      if(selectedIncident?.id === updatedIncident.id) setSelectedIncident(updatedIncident);
    } else { // Adding new incident
      const newReport: Incident = {
        id: `INC${String(incidents.length + 101).padStart(3, '0')}`, // Ensure unique IDs
        type: formValues.type!,
        location: formValues.location!,
        severity: formValues.severity as Incident["severity"],
        status: formValues.status || "Pending",
        reportedAt: now,
        description: formValues.description!,
        assignedTo: formValues.assignedTo,
        updatedAt: now,
      };
      setIncidents(prev => [newReport, ...prev]);
      toast({ title: "New Incident Reported", description: `Incident ${newReport.id} has been created.` });
      setIsNewReportModalOpen(false);
    }
    setFormValues({ type: "Accident", severity: "Medium" }); // Reset form
  };
  
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
   const handleFormSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const SortableTableHead = ({ sortKeyName, children }: { sortKeyName: keyof Incident; children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent hover:text-primary data-[active=true]:text-primary" onClick={() => handleSort(sortKeyName)} data-active={sortKey === sortKeyName}>
        {children}
        {sortKey === sortKeyName && <ArrowUpDown className="ml-2 h-3 w-3" />}
      </Button>
    </TableHead>
  );


  return (
    <div className="container mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <AlertTriangle className="h-10 w-10" />
          Incident Management
        </h1>
        <p className="text-muted-foreground mt-1">Track, manage, and resolve traffic incidents effectively.</p>
      </header>
      
      <Card className="mb-8 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="relative lg:col-span-2">
               <Label htmlFor="search-incidents" className="sr-only">Search Incidents</Label>
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                id="search-incidents"
                type="search" 
                placeholder="Search ID, type, location, description..." 
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:col-span-3 gap-3">
              <Select value={filterType} onValueChange={(value) => { setFilterType(value); setCurrentPage(1);}}>
                <SelectTrigger><SelectValue placeholder="Filter by Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="major_accident">Major Accident</SelectItem>
                  <SelectItem value="minor_accident">Minor Accident</SelectItem>
                  <SelectItem value="road_closure">Road Closure</SelectItem>
                  <SelectItem value="weather_alert">Weather Alert</SelectItem>
                  <SelectItem value="traffic_jam">Traffic Jam</SelectItem>
                  <SelectItem value="signal_malfunction">Signal Malfunction</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filterSeverity} onValueChange={(value) => { setFilterSeverity(value); setCurrentPage(1);}}>
                <SelectTrigger><SelectValue placeholder="Filter by Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => { setFilterStatus(value); setCurrentPage(1);}}>
                <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 md:p-6 border-t flex justify-end">
             <Button onClick={handleOpenNewReportModal} className="bg-primary hover:bg-primary/90">
                <ListPlus className="h-5 w-5 mr-2" />
                Report New Incident
              </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableTableHead sortKeyName="id">ID</SortableTableHead>
                  <SortableTableHead sortKeyName="type">Type</SortableTableHead>
                  <TableHead>Location</TableHead>
                  <SortableTableHead sortKeyName="severity">Severity</SortableTableHead>
                  <SortableTableHead sortKeyName="status">Status</SortableTableHead>
                  <SortableTableHead sortKeyName="reportedAt">Reported</SortableTableHead>
                  <SortableTableHead sortKeyName="updatedAt">Updated</SortableTableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIncidents.map((incident) => {
                  const severityDetails = getSeverityBadgeDetails(incident.severity);
                  const statusDetails = getStatusBadgeDetails(incident.status);
                  return (
                    <TableRow key={incident.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-primary">{incident.id}</TableCell>
                      <TableCell className="font-medium">{incident.type}</TableCell>
                      <TableCell className="max-w-xs truncate" title={incident.location}>{incident.location}</TableCell>
                      <TableCell>
                        <Badge variant={severityDetails.variant} className={severityDetails.className}>{incident.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusDetails.className}>
                          {statusDetails.icon} {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(incident.reportedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(incident.updatedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(incident)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditReportModal(incident)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit Incident
                            </DropdownMenuItem>
                            {incident.status !== "Resolved" && incident.status !== "Closed" && (
                              <DropdownMenuItem onClick={() => handleEscalateIncident(incident)} className="cursor-pointer text-orange-600 focus:text-orange-700 focus:bg-orange-100 dark:focus:bg-orange-800">
                                <ArrowUpCircle className="mr-2 h-4 w-4" /> Escalate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Incident
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete incident {incident.id} ({incident.type})? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteIncident(incident.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row items-center justify-between pt-4 p-4 md:p-6 border-t">
          <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
            Showing {paginatedIncidents.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedIncidents.length)} of {filteredAndSortedIncidents.length} incidents.
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          )}
        </CardFooter>
        {paginatedIncidents.length === 0 && (
            <CardContent className="p-10 text-center text-muted-foreground">
                 <PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                <h3 className="text-xl font-semibold mb-2">No Incidents Found</h3>
                <p>There are no incidents matching your current filter criteria.</p>
            </CardContent>
        )}
      </Card>

      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={(open) => !open && setSelectedIncident(null)}>
          <DialogContent className="sm:max-w-lg p-0">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="text-xl">Incident Details: <span className="font-mono text-primary">{selectedIncident.id}</span></DialogTitle>
              <div className="flex flex-wrap gap-2 items-center pt-1">
                <Badge variant="outline" className={(getStatusBadgeDetails(selectedIncident.status)).className}>
                  {(getStatusBadgeDetails(selectedIncident.status)).icon} {selectedIncident.status}
                </Badge>
                <Badge variant={getSeverityBadgeDetails(selectedIncident.severity).variant} className={getSeverityBadgeDetails(selectedIncident.severity).className}>
                   {selectedIncident.severity}
                </Badge>
              </div>
            </DialogHeader>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <p><strong>Type:</strong> {selectedIncident.type}</p>
              <p><strong>Location:</strong> {selectedIncident.location}</p>
              <p><strong>Reported At:</strong> {new Date(selectedIncident.reportedAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedIncident.updatedAt).toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedIncident.description}</p>
              {selectedIncident.assignedTo && <p><strong>Assigned To:</strong> {selectedIncident.assignedTo}</p>}
              {selectedIncident.resolutionNotes && <p><strong>Resolution Notes:</strong> {selectedIncident.resolutionNotes}</p>}

              {(selectedIncident.status === "Active" || selectedIncident.status === "Investigating" || selectedIncident.status === "Monitoring") && (
                <div className="pt-2">
                  <Label htmlFor="resolutionNotesDialog" className="font-semibold">Resolution Notes (if resolving):</Label>
                  <Textarea id="resolutionNotesDialog" name="resolutionNotesDialog" placeholder="Enter resolution details..." className="mt-1"/>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between p-6 pt-4 border-t bg-muted/30">
                {(selectedIncident.status === "Active" || selectedIncident.status === "Investigating") && (
                    <Button variant="outline" onClick={() => handleEscalateIncident(selectedIncident)} className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                        <ArrowUpCircle className="mr-2 h-4 w-4"/> Escalate
                    </Button>
                )}
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                    {(selectedIncident.status === "Active" || selectedIncident.status === "Investigating" || selectedIncident.status === "Monitoring") && (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
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
                                <AlertDialogAction 
                                    onClick={() => handleResolveIncident(selectedIncident.id, (document.getElementById('resolutionNotesDialog') as HTMLTextAreaElement)?.value || '')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Confirm Resolve
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isNewReportModalOpen || isEditReportModalOpen} onOpenChange={isNewReportModalOpen ? setIsNewReportModalOpen : setIsEditReportModalOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>{incidentToEdit ? "Edit Incident Report" : "Report New Incident"}</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label htmlFor="incidentType">Type <span className="text-destructive">*</span></Label>
              <Select name="type" value={formValues.type} onValueChange={(value) => handleFormSelectChange("type", value)}>
                <SelectTrigger id="incidentType"><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Major Accident">Major Accident</SelectItem>
                  <SelectItem value="Minor Accident">Minor Accident</SelectItem>
                  <SelectItem value="Road Closure">Road Closure</SelectItem>
                  <SelectItem value="Weather Alert">Weather Alert</SelectItem>
                  <SelectItem value="Traffic Jam">Traffic Jam</SelectItem>
                  <SelectItem value="Signal Malfunction">Signal Malfunction</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="incidentLocation">Location <span className="text-destructive">*</span></Label>
              <Input id="incidentLocation" name="location" value={formValues.location || ""} onChange={handleFormInputChange} placeholder="e.g., Main St & 1st Ave" />
            </div>
            <div>
              <Label htmlFor="incidentSeverity">Severity <span className="text-destructive">*</span></Label>
               <Select name="severity" value={formValues.severity} onValueChange={(value) => handleFormSelectChange("severity", value)}>
                <SelectTrigger id="incidentSeverity"><SelectValue placeholder="Select severity..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {incidentToEdit && (
                <div>
                <Label htmlFor="incidentStatus">Status</Label>
                <Select name="status" value={formValues.status} onValueChange={(value) => handleFormSelectChange("status", value)}>
                    <SelectTrigger id="incidentStatus"><SelectValue placeholder="Select status..." /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Investigating">Investigating</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            )}
            <div>
              <Label htmlFor="incidentDescription">Description <span className="text-destructive">*</span></Label>
              <Textarea id="incidentDescription" name="description" value={formValues.description || ""} onChange={handleFormInputChange} placeholder="Describe the incident..." rows={4} />
            </div>
             <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" name="assignedTo" value={formValues.assignedTo || ""} onChange={handleFormInputChange} placeholder="e.g., Team Alpha, System" />
            </div>
            {incidentToEdit && formValues.status === "Resolved" && (
                 <div>
                    <Label htmlFor="resolutionNotesForm">Resolution Notes</Label>
                    <Textarea id="resolutionNotesForm" name="resolutionNotes" value={formValues.resolutionNotes || ""} onChange={handleFormInputChange} placeholder="Enter resolution details..."/>
                </div>
            )}
          </div>
          <DialogFooter className="p-6 pt-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => incidentToEdit ? setIsEditReportModalOpen(false) : setIsNewReportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit} className="bg-primary hover:bg-primary/90">{incidentToEdit ? "Save Changes" : "Submit Report"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
