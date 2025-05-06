
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, TrafficCone, AlertOctagon, Bus, Ambulance } from "lucide-react";
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

type IntersectionStatus = {
  id: string;
  name: string;
  currentSignal: string;
  priority: "None" | "Emergency Services" | "Public Transport";
  publicTransportPriorityActive: boolean;
  emergencyVehiclePriorityActive: boolean;
};

const initialIntersections: IntersectionStatus[] = [
  { id: "int1", name: "Main St & 1st Ave", currentSignal: "Normal Cycle", priority: "None", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: false },
  { id: "int2", name: "Oak Rd & Pine Ln", currentSignal: "Normal Cycle", priority: "None", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: false },
  { id: "int3", name: "Highway 101 Exit 5", currentSignal: "Flashing Yellow (Caution)", priority: "Emergency Services", publicTransportPriorityActive: false, emergencyVehiclePriorityActive: true },
  { id: "int4", name: "City Center Plaza", currentSignal: "Normal Cycle", priority: "Public Transport", publicTransportPriorityActive: true, emergencyVehiclePriorityActive: false },
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
      // In a real app, this would send a command to the traffic control system
      setIntersections(prev => prev.map(int => 
        int.id === selectedIntersectionId ? { ...int, currentSignal: selectedSignalAction, priority: selectedSignalAction.includes("Emergency") ? "Emergency Services" : int.priority } : int
      ));
      toast({
        title: "Signal Override Applied",
        description: `Signal at ${intersection.name} set to ${selectedSignalAction}.`,
      });
      setSelectedIntersectionId(undefined);
      setSelectedSignalAction(undefined);
    }
  };

  const handlePriorityToggle = (intersectionId: string, type: 'pt' | 'ev', checked: boolean) => {
     setIntersections(prev => prev.map(int => {
      if (int.id === intersectionId) {
        const newPriority = type === 'pt' && checked ? "Public Transport" : type === 'ev' && checked ? "Emergency Services" : "None";
        // If one priority is activated, deactivate the other for simplicity
        const ptActive = type === 'pt' ? checked : (checked && type === 'ev' ? false : int.publicTransportPriorityActive);
        const evActive = type === 'ev' ? checked : (checked && type === 'pt' ? false : int.emergencyVehiclePriorityActive);
        
        return { 
          ...int, 
          priority: newPriority,
          publicTransportPriorityActive: ptActive,
          emergencyVehiclePriorityActive: evActive,
        };
      }
      return int;
    }));
  };

  const handleUpdatePrioritySettings = () => {
    // In a real app, this would send updated priority settings to the backend/system
    toast({
      title: "Priority Settings Updated",
      description: "Priority lane configurations have been updated.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
        <SlidersHorizontal className="h-8 w-8" />
        Control Interface
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrafficCone className="text-primary"/>Manual Signal Override</CardTitle>
            <CardDescription>Take manual control of traffic signals in emergency situations. Use with extreme caution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="intersection-select" className="text-base font-semibold">Select Intersection</Label>
              <Select value={selectedIntersectionId} onValueChange={setSelectedIntersectionId}>
                <SelectTrigger id="intersection-select" className="mt-1">
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
              <Label htmlFor="signal-action" className="text-base font-semibold">Select Override Action</Label>
              <Select value={selectedSignalAction} onValueChange={setSelectedSignalAction}>
                <SelectTrigger id="signal-action" className="mt-1">
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
                <Button variant="destructive" className="w-full flex items-center gap-2" disabled={!selectedIntersectionId || !selectedSignalAction}>
                  <AlertOctagon className="h-5 w-5"/> Apply Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Signal Override</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will immediately change the traffic signal status at {intersections.find(int => int.id === selectedIntersectionId)?.name || 'the selected intersection'} to {selectedSignalAction || 'the selected action'}. 
                    Ensure this is a necessary emergency measure. Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApplyOverride}>Confirm & Apply</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bus className="text-primary"/>Priority Lanes Toggle</CardTitle>
            <CardDescription>Activate or deactivate priority lanes for public transport or emergency vehicles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {intersections.map(int => (
               <div key={int.id} className="p-4 border rounded-md bg-secondary/30">
                <h3 className="font-semibold text-lg mb-2">{int.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor={`priority-pt-${int.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Bus className="h-5 w-5 text-blue-600"/> Public Transport Priority
                  </Label>
                  <Switch 
                    id={`priority-pt-${int.id}`} 
                    checked={int.publicTransportPriorityActive} 
                    onCheckedChange={(checked) => handlePriorityToggle(int.id, 'pt', checked)}
                    aria-label={`Toggle public transport priority for ${int.name}`}/>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`priority-ev-${int.id}`} className="flex items-center gap-2 cursor-pointer">
                   <Ambulance className="h-5 w-5 text-red-600"/> Emergency Vehicle Priority
                  </Label>
                  <Switch 
                    id={`priority-ev-${int.id}`} 
                    checked={int.emergencyVehiclePriorityActive} 
                    onCheckedChange={(checked) => handlePriorityToggle(int.id, 'ev', checked)}
                    aria-label={`Toggle emergency vehicle priority for ${int.name}`}/>
                </div>
              </div>
            ))}
             <Button variant="default" className="w-full mt-4" onClick={handleUpdatePrioritySettings}>Update Priority Settings</Button>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Current System Status</CardTitle>
          <CardDescription>Overview of active overrides and priority settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {intersections.map(int => (
              <li key={int.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                <span className="font-medium">{int.name}</span>
                <div className="text-right">
                  <span className={`text-sm ${int.currentSignal.includes("Normal") ? 'text-green-600' : 'text-orange-500'}`}>{int.currentSignal}</span><br/>
                  <span className={`text-xs ${int.priority === "None" ? 'text-muted-foreground' : 'text-accent-foreground bg-accent px-1 rounded'}`}>{int.priority} Priority</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
