
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator"; // No longer used
import { Settings, User, Bell, Database, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
// import { useTheme } from "next-themes"; // Assuming next-themes for dark mode

export default function SettingsPage() {
  const { toast } = useToast();
  // const { theme, setTheme } = useTheme(); // For next-themes
  const [currentTheme, setCurrentTheme] = useState("light"); // Local state for demo if next-themes not fully set up
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    newPassword: "",
    avatarUrl: "https://picsum.photos/80/80"
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    incidentAlerts: true,
    systemUpdates: false,
    reportSummaries: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    darkMode: false, // Will be derived from theme
    dataRetention: "90",
  });

  // Sync local theme state with actual theme (e.g., from next-themes or localStorage)
  useEffect(() => {
     // If using next-themes, 'theme' would come from useTheme()
     // For now, basic localStorage example or default to light
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : "light";
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    setCurrentTheme(initialTheme);
    setSystemSettings(s => ({ ...s, darkMode: initialTheme === "dark" }));
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
  };

  const handleSaveProfile = () => {
    toast({ title: "Profile Saved", description: "Your profile information has been updated." });
    // API call to save profileData
  };
  
  const handleChangeAvatar = () => {
    toast({ title: "Change Avatar", description: "Avatar upload functionality would be here." });
    // Logic to open file picker and upload avatar
  };

  const handleNotificationToggle = (id: keyof typeof notificationPrefs, checked?: boolean) => {
    // For Checkbox, 'checked' is the value itself. For Switch, it's in onCheckedChange.
    const value = typeof checked === 'boolean' ? checked : !notificationPrefs[id];
    setNotificationPrefs({ ...notificationPrefs, [id]: value });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notification Settings Saved", description: "Your notification preferences have been updated." });
    // API call to save notificationPrefs
  };
  
  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSystemSettings({ ...systemSettings, [e.target.id]: e.target.value });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    // setTheme(newTheme); // if using next-themes
    setCurrentTheme(newTheme); // local state
    setSystemSettings({ ...systemSettings, darkMode: checked });
     if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", checked);
        localStorage.setItem("theme", newTheme);
     }
  };

  const handleSaveSystemSettings = () => {
    toast({ title: "System Settings Saved", description: "General system configurations have been updated." });
    // API call to save systemSettings
  };

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
                <AvatarImage src={profileData.avatarUrl} data-ai-hint="user profile" alt="User Avatar" />
                <AvatarFallback>{profileData.firstName?.[0]}{profileData.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleChangeAvatar}>Change Avatar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={profileData.firstName} onChange={handleProfileChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={profileData.lastName} onChange={handleProfileChange} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="Enter new password" value={profileData.newPassword} onChange={handleProfileChange} className="mt-1" />
            </div>
            <Button onClick={handleSaveProfile}>Save Profile</Button>
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
              <Label htmlFor="emailNotifications" className="font-medium cursor-pointer">Email Notifications</Label>
              <Switch id="emailNotifications" checked={notificationPrefs.emailNotifications} onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)} aria-label="Toggle email notifications"/>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <Label htmlFor="pushNotifications" className="font-medium cursor-pointer">Push Notifications (Mobile)</Label>
              <Switch id="pushNotifications" checked={notificationPrefs.pushNotifications} onCheckedChange={(checked) => handleNotificationToggle("pushNotifications", checked)} aria-label="Toggle push notifications"/>
            </div>
            <p className="text-sm font-semibold mt-4">Notify me about:</p>
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="incidentAlerts" checked={notificationPrefs.incidentAlerts} onCheckedChange={(checked) => handleNotificationToggle("incidentAlerts", Boolean(checked))} />
                <Label htmlFor="incidentAlerts" className="cursor-pointer">Critical Incident Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="systemUpdates" checked={notificationPrefs.systemUpdates} onCheckedChange={(checked) => handleNotificationToggle("systemUpdates", Boolean(checked))} />
                <Label htmlFor="systemUpdates" className="cursor-pointer">System Maintenance & Updates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reportSummaries" checked={notificationPrefs.reportSummaries} onCheckedChange={(checked) => handleNotificationToggle("reportSummaries", Boolean(checked))} />
                <Label htmlFor="reportSummaries" className="cursor-pointer">Daily/Weekly Report Summaries</Label>
              </div>
            </div>
            <Button className="mt-4" onClick={handleSaveNotifications}>Save Notification Settings</Button>
          </CardContent>
        </Card>

        {/* System Settings (Simplified) */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="text-primary" />System Settings</CardTitle>
            <CardDescription>General system configurations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <Label htmlFor="darkMode" className="font-medium flex items-center gap-1 cursor-pointer"><Palette/> Dark Mode</Label>
              <Switch id="darkMode" checked={systemSettings.darkMode} onCheckedChange={handleDarkModeToggle} aria-label="Toggle dark mode"/>
            </div>
             <div>
              <Label htmlFor="dataRetention">Data Retention Period (Days)</Label>
              <Input id="dataRetention" type="number" value={systemSettings.dataRetention} onChange={handleSystemSettingsChange} className="mt-1" />
            </div>
            <Button className="mt-2" onClick={handleSaveSystemSettings}>Save System Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
