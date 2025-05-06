
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, TrafficCone, AlertOctagon, Bus, Ambulance, CheckCircle, XCircle, ShieldCheck, Ban } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

type IntersectionStatus = {
  id: string;
  name: string;
  currentSignal: string;
  mode: "Normal" | "Override" | "Priority";
  publicTransportPriorityActive: boolean;
  emergencyVehiclePriorityActive: boolean;
};

const initialIntersections: IntersectionStatus[] = [
  { id: "int1", name: "Main St & 1st Ave", currentSignal: "Normal Cycle", mode: "Normal", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: false },
  { id: "int2", name: "Oak Rd & Pine Ln", currentSignal: "Normal Cycle", mode: "Normal", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: false },
  { id: "int3", name: "Highway 101 Exit 5", currentSignal: "Flashing Yellow", mode: "Override", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: true },
  { id: "int4", name: "City Center Plaza", currentSignal: "Bus Priority Cycle", mode: "Priority", publicTransportPriorityActive: true, emergencyVehiclePriorityActive: false },
];

export default function ControlInterfacePage() {
  const { toast } = useToast();
  const [intersections, setIntersections] = useState<IntersectionStatus[]>(initialIntersections);
  const [selectedIntersectionId, setSelectedIntersectionId] = useState<string | undefined>();
  const [selectedSignalAction, setSelectedSignalAction] = useState<string | undefined>();

  const handleApplyOverride = () => {
    if (!selectedIntersectionId || !selectedSignalAction) {
      toast({
        title: "Selection Missing",
        description: "Please select an intersection and an override action.",
        variant: "destructive",
      });
      return;
    }
    const intersection = intersections.find(int => int.id === selectedIntersectionId);
    if (intersection) {
      setIntersections(prev => prev.map(int => {
        if (int.id === selectedIntersectionId) {
          const isEmergency = selectedSignalAction.toLowerCase().includes("emergency") || selectedSignalAction.toLowerCase().includes("all red");
          const isNormal = selectedSignalAction.toLowerCase().includes("normal cycle");
          return { 
            ...int, 
            currentSignal: selectedSignalAction, 
            mode: isNormal ? "Normal" : "Override",
            emergencyVehiclePriorityActive: isEmergency ? true : (isNormal ? false : int.emergencyVehiclePriorityActive),
            publicTransportPriorityActive: isNormal ? false : int.publicTransportPriorityActive,
          };
        }
        return int;
      }));
      toast({
        title: "Signal Override Applied",
        description: `Signal at ${intersection.name} set to ${selectedSignalAction}.`,
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      setSelectedIntersectionId(undefined);
      setSelectedSignalAction(undefined);
    }
  };

  const handlePriorityToggle = (intersectionId: string, type: 'pt' | 'ev', checked: boolean) => {
     setIntersections(prev => prev.map(int => {
      if (int.id === intersectionId) {
        const ptActive = type === 'pt' ? checked : (type === 'ev' && checked ? false : int.publicTransportPriorityActive);
        const evActive = type === 'ev' ? checked : (type === 'pt' && checked ? false : int.emergencyVehiclePriorityActive);
        
        let newMode: IntersectionStatus["mode"] = "Normal";
        let newSignal = "Normal Cycle";

        if (evActive) {
          newMode = "Priority";
          newSignal = "Emergency Vehicle Priority Active";
        } else if (ptActive) {
          newMode = "Priority";
          newSignal = "Public Transport Priority Active";
        }
        
        return { 
          ...int, 
          mode: newMode,
          currentSignal: newSignal,
          publicTransportPriorityActive: ptActive,
          emergencyVehiclePriorityActive: evActive,
        };
      }
      return int;
    }));
    const intersectionName = intersections.find(i => i.id === intersectionId)?.name || "the intersection";
    const priorityType = type === 'pt' ? "Public Transport" : "Emergency Vehicle";
    toast({
        title: `${priorityType} Priority ${checked ? 'Activated' : 'Deactivated'}`,
        description: `${priorityType} priority has been ${checked ? 'enabled' : 'disabled'} for ${intersectionName}.`,
    });
  };

  const handleUpdateAllPriorities = () => {
    toast({
      title: "Priority Settings Updated",
      description: "All priority lane configurations have been broadcasted to the system.",
      className: "bg-blue-500 text-white dark:bg-blue-600",
    });
  };

  const getModeBadge = (mode: IntersectionStatus["mode"]) => {
    switch(mode) {
      case "Normal": return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border-green-400"><CheckCircle className="mr-1 h-3 w-3"/>Normal</Badge>;
      case "Override": return <Badge variant="destructive"><AlertOctagon className="mr-1 h-3 w-3"/>Override</Badge>;
      case "Priority": return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border-blue-400"><ShieldCheck className="mr-1 h-3 w-3"/>Priority</Badge>;
      default: return <Badge variant="outline">{mode}</Badge>;
    }
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <SlidersHorizontal className="h-10 w-10" />
          Signal Control Interface
        </h1>
        <p className="text-muted-foreground mt-1">Manage traffic signal operations and priority configurations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl"><TrafficCone className="text-orange-500"/>Manual Signal Override</CardTitle>
            <CardDescription>Take direct control of signals in critical situations. Use with extreme caution.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="intersection-select" className="text-base font-medium mb-1 block">Select Intersection</Label>
              <Select value={selectedIntersectionId} onValueChange={setSelectedIntersectionId}>
                <SelectTrigger id="intersection-select" className="w-full">
                  <SelectValue placeholder="Choose an intersection..." />
                </SelectTrigger>
                <SelectContent>
                  {intersections.map(int => (
                    <SelectItem key={int.id} value={int.id}>{int.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="signal-action" className="text-base font-medium mb-1 block">Select Override Action</Label>
              <Select value={selectedSignalAction} onValueChange={setSelectedSignalAction} disabled={!selectedIntersectionId}>
                <SelectTrigger id="signal-action" className="w-full">
                  <SelectValue placeholder="Choose an action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Red (Emergency Stop)">All Red (Emergency Stop)</SelectItem>
                  <SelectItem value="Flashing Yellow (Caution)">Flashing Yellow (Caution)</SelectItem>
                  <SelectItem value="Force Green (North/South)">Force Green (North/South)</SelectItem>
                  <SelectItem value="Force Green (East/West)">Force Green (East/West)</SelectItem>
                  <SelectItem value="Resume Normal Cycle">Resume Normal Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center gap-2 py-3 text-base" disabled={!selectedIntersectionId || !selectedSignalAction}>
                  <AlertOctagon className="h-5 w-5"/> Apply Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">Confirm Signal Override</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to change the signal at <span className="font-semibold">{intersections.find(int => int.id === selectedIntersectionId)?.name || 'the selected intersection'}</span> to <span className="font-semibold">{selectedSignalAction || 'the selected action'}</span>. 
                    This is a high-impact operation. Ensure it is necessary.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApplyOverride} className="bg-destructive hover:bg-destructive/90">Confirm & Apply</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl"><Bus className="text-blue-500"/>Priority Lanes Configuration</CardTitle>
            <CardDescription>Activate or deactivate priority signal timing for specific vehicle types.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {intersections.map(int => (
               <div key={int.id} className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-3 text-primary">{int.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                    <Label htmlFor={`priority-pt-${int.id}`} className="flex items-center gap-2 cursor-pointer text-sm">
                      <Bus className="h-5 w-5 text-blue-600"/> Public Transport Priority
                    </Label>
                    <Switch 
                      id={`priority-pt-${int.id}`} 
                      checked={int.publicTransportPriorityActive} 
                      onCheckedChange={(checked) => handlePriorityToggle(int.id, 'pt', checked)}
                      aria-label={`Toggle public transport priority for ${int.name}`}/>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                    <Label htmlFor={`priority-ev-${int.id}`} className="flex items-center gap-2 cursor-pointer text-sm">
                     <Ambulance className="h-5 w-5 text-red-600"/> Emergency Vehicle Priority
                    </Label>
                    <Switch 
                      id={`priority-ev-${int.id}`} 
                      checked={int.emergencyVehiclePriorityActive} 
                      onCheckedChange={(checked) => handlePriorityToggle(int.id, 'ev', checked)}
                      aria-label={`Toggle emergency vehicle priority for ${int.name}`}/>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t p-6">
             <Button variant="default" className="w-full py-3 text-base" onClick={handleUpdateAllPriorities}>
                <ShieldCheck className="mr-2 h-5 w-5"/> Update All Priority Settings
             </Button>
          </CardFooter>
        </Card>
      </div>

       <Card className="mt-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Current System Status Overview</CardTitle>
          <CardDescription>Real-time status of all managed intersections.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {intersections.map(int => (
              <li key={int.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-muted/50 transition-colors">
                <div className="mb-2 sm:mb-0">
                    <span className="font-semibold text-lg text-foreground">{int.name}</span>
                    <div className="text-sm text-muted-foreground mt-0.5">{int.currentSignal}</div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                    {getModeBadge(int.mode)}
                    {int.publicTransportPriorityActive && <Badge variant="outline" className="border-blue-500 text-blue-600"><Bus size={14} className="mr-1"/> PT Active</Badge>}
                    {int.emergencyVehiclePriorityActive && <Badge variant="outline" className="border-red-500 text-red-600"><Ambulance size={14} className="mr-1"/> EV Active</Badge>}
                </div>
              </li>
            ))}
             {intersections.length === 0 && <li className="p-6 text-center text-muted-foreground">No intersections configured or active.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
