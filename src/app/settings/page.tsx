import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Database, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
        <Settings className="h-8 w-8" />
        Settings
      </h1>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="text-primary" />Profile Settings</CardTitle>
            <CardDescription>Manage your personal information and account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://picsum.photos/80/80" data-ai-hint="user profile" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" className="mt-1" />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="text-primary" />Notification Preferences</CardTitle>
            <CardDescription>Control how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
              <Switch id="emailNotifications" defaultChecked aria-label="Toggle email notifications"/>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <Label htmlFor="pushNotifications" className="font-medium">Push Notifications (Mobile)</Label>
              <Switch id="pushNotifications" aria-label="Toggle push notifications"/>
            </div>
            <p className="text-sm font-semibold mt-4">Notify me about:</p>
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="incidentAlerts" defaultChecked />
                <Label htmlFor="incidentAlerts">Critical Incident Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="systemUpdates" />
                <Label htmlFor="systemUpdates">System Maintenance & Updates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reportSummaries" defaultChecked />
                <Label htmlFor="reportSummaries">Daily/Weekly Report Summaries</Label>
              </div>
            </div>
            <Button className="mt-4">Save Notification Settings</Button>
          </CardContent>
        </Card>

        {/* System Settings (Simplified) */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="text-primary" />System Settings</CardTitle>
            <CardDescription>General system configurations (admin-level settings might be elsewhere).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <Label htmlFor="darkMode" className="font-medium flex items-center gap-1"><Palette/> Dark Mode</Label>
              <Switch id="darkMode" aria-label="Toggle dark mode"/>
            </div>
             <div>
              <Label htmlFor="dataRetention">Data Retention Period (Days)</Label>
              <Input id="dataRetention" type="number" defaultValue="90" className="mt-1" />
            </div>
            <Button className="mt-2">Save System Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
