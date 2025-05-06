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


const intersections = [
  { id: "int1", name: "Main St & 1st Ave", currentSignal: "Normal Cycle", priority: "None" },
  { id: "int2", name: "Oak Rd & Pine Ln", currentSignal: "Normal Cycle", priority: "None" },
  { id: "int3", name: "Highway 101 Exit 5", currentSignal: "Flashing Yellow (Caution)", priority: "Emergency Services" },
  { id: "int4", name: "City Center Plaza", currentSignal: "Normal Cycle", priority: "Public Transport" },
];

export default function ControlInterfacePage() {
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
              <Select>
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
              <Select>
                <SelectTrigger id="signal-action" className="mt-1">
                  <SelectValue placeholder="Choose an action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_red">All Red (Emergency Stop)</SelectItem>
                  <SelectItem value="flash_yellow">Flashing Yellow (Caution)</SelectItem>
                  <SelectItem value="force_green_ns">Force Green (North/South)</SelectItem>
                  <SelectItem value="force_green_ew">Force Green (East/West)</SelectItem>
                  <SelectItem value="resume_normal">Resume Normal Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5"/> Apply Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Signal Override</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will immediately change the traffic signal status at the selected intersection. 
                    Ensure this is a necessary emergency measure. Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Confirm & Apply</AlertDialogAction>
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
            {intersections.filter(int => int.id === "int3" || int.id === "int4").map(int => ( // Example: only show for specific intersections
               <div key={int.id} className="p-4 border rounded-md bg-secondary/30">
                <h3 className="font-semibold text-lg mb-2">{int.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor={`priority-pt-${int.id}`} className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-blue-600"/> Public Transport Priority
                  </Label>
                  <Switch id={`priority-pt-${int.id}`} defaultChecked={int.priority === "Public Transport"} aria-label={`Toggle public transport priority for ${int.name}`}/>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`priority-ev-${int.id}`} className="flex items-center gap-2">
                   <Ambulance className="h-5 w-5 text-red-600"/> Emergency Vehicle Priority
                  </Label>
                  <Switch id={`priority-ev-${int.id}`} defaultChecked={int.priority === "Emergency Services"} aria-label={`Toggle emergency vehicle priority for ${int.name}`}/>
                </div>
              </div>
            ))}
             <Button variant="default" className="w-full mt-4">Update Priority Settings</Button>
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
