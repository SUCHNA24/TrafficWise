
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, User, Bell, Database, Palette, ShieldCheck, UploadCloud, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState("light"); 
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    newPassword: "",
    confirmPassword: "",
    avatarUrl: "https://picsum.photos/seed/avatar1/120/120" 
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    incidentAlerts: true,
    systemUpdates: false,
    reportSummaries: true,
    performanceThresholds: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    dataRetention: "90",
    autoLogoutTime: "30", // in minutes
  });

  useEffect(() => {
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
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
      return;
    }
    toast({ title: "Profile Saved", description: "Your profile information has been updated successfully.", className: "bg-green-500 text-white dark:bg-green-600" });
  };
  
  const handleChangeAvatar = () => {
    toast({ title: "Change Avatar", description: "Avatar upload functionality would be handled here (e.g., opening a file picker)." });
  };

  const handleNotificationToggle = (id: keyof typeof notificationPrefs, checked?: boolean) => {
    const value = typeof checked === 'boolean' ? checked : !notificationPrefs[id];
    setNotificationPrefs({ ...notificationPrefs, [id]: value });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notification Settings Saved", description: "Your notification preferences have been updated.", className: "bg-blue-500 text-white dark:bg-blue-600" });
  };
  
  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSystemSettings({ ...systemSettings, [e.target.id]: e.target.value });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setCurrentTheme(newTheme); 
    setSystemSettings({ ...systemSettings, darkMode: checked });
     if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", checked);
        localStorage.setItem("theme", newTheme);
     }
     toast({ title: "Theme Changed", description: `Switched to ${newTheme} mode.`});
  };

  const handleSaveSystemSettings = () => {
    toast({ title: "System Settings Saved", description: "General system configurations have been updated.", className: "bg-purple-500 text-white dark:bg-purple-600" });
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <Settings className="h-10 w-10" />
          Application Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account, notifications, and system preferences.</p>
      </header>

      <div className="space-y-10">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl"><User className="text-primary" />Profile Information</CardTitle>
            <CardDescription>Manage your personal details and account credentials.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profileData.avatarUrl} data-ai-hint="user profile photography" alt="User Avatar" />
                <AvatarFallback className="text-3xl bg-muted">{profileData.firstName?.[0]}{profileData.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <Button variant="outline" onClick={handleChangeAvatar} className="w-full sm:w-auto">
                  <UploadCloud className="mr-2 h-4 w-4"/> Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Recommended: JPG or PNG, max 2MB.</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="font-medium">First Name</Label>
                <Input id="firstName" value={profileData.firstName} onChange={handleProfileChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName" className="font-medium">Last Name</Label>
                <Input id="lastName" value={profileData.lastName} onChange={handleProfileChange} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="font-medium">Email Address</Label>
              <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} className="mt-1" />
            </div>
             <Separator />
            <div className="space-y-2">
                <h3 className="text-md font-semibold flex items-center gap-2"><KeyRound className="text-muted-foreground"/> Change Password</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" value={profileData.newPassword} onChange={handleProfileChange} className="mt-1" />
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={profileData.confirmPassword} onChange={handleProfileChange} className="mt-1" />
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6">
            <Button onClick={handleSaveProfile} size="lg" className="ml-auto bg-primary hover:bg-primary/90">Save Profile Changes</Button>
          </CardFooter>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl"><Bell className="text-primary" />Notification Preferences</CardTitle>
            <CardDescription>Control how and when you receive alerts and updates from the system.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-lg border transition-colors">
              <Label htmlFor="emailNotifications" className="font-medium cursor-pointer flex-grow">Email Notifications</Label>
              <Switch id="emailNotifications" checked={notificationPrefs.emailNotifications} onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)} aria-label="Toggle email notifications"/>
            </div>
            <div className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-lg border transition-colors">
              <Label htmlFor="pushNotifications" className="font-medium cursor-pointer flex-grow">Push Notifications (Mobile App)</Label>
              <Switch id="pushNotifications" checked={notificationPrefs.pushNotifications} onCheckedChange={(checked) => handleNotificationToggle("pushNotifications", checked)} aria-label="Toggle push notifications"/>
            </div>
            <Separator />
            <p className="text-md font-semibold pt-2">Notify me about:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2">
              {[
                {id: "incidentAlerts", label: "Critical Incident Alerts"},
                {id: "systemUpdates", label: "System Maintenance & Updates"},
                {id: "reportSummaries", label: "Daily/Weekly Report Summaries"},
                {id: "performanceThresholds", label: "Performance Threshold Breaches"},
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-card rounded-md border hover:border-primary/50 transition-colors">
                  <Checkbox 
                    id={item.id} 
                    checked={notificationPrefs[item.id as keyof typeof notificationPrefs]} 
                    onCheckedChange={(checked) => handleNotificationToggle(item.id as keyof typeof notificationPrefs, Boolean(checked))} 
                  />
                  <Label htmlFor={item.id} className="cursor-pointer text-sm font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
           <CardFooter className="border-t p-6">
            <Button onClick={handleSaveNotifications} size="lg" className="ml-auto bg-blue-600 hover:bg-blue-700">Save Notification Settings</Button>
          </CardFooter>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl"><Database className="text-primary" />System & Data Settings</CardTitle>
            <CardDescription>Configure general system behavior, appearance, and data management.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-lg border transition-colors">
              <Label htmlFor="darkMode" className="font-medium flex items-center gap-2 cursor-pointer flex-grow"><Palette className="text-muted-foreground"/> Dark Mode</Label>
              <Switch id="darkMode" checked={systemSettings.darkMode} onCheckedChange={handleDarkModeToggle} aria-label="Toggle dark mode"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="dataRetention" className="font-medium">Data Retention Period (Days)</Label>
              <Input id="dataRetention" type="number" value={systemSettings.dataRetention} onChange={handleSystemSettingsChange} className="mt-1" placeholder="e.g., 90"/>
              <p className="text-xs text-muted-foreground">How long historical data should be stored before archival or deletion.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoLogoutTime" className="font-medium">Automatic Logout Time (Minutes)</Label>
              <Input id="autoLogoutTime" type="number" value={systemSettings.autoLogoutTime} onChange={handleSystemSettingsChange} className="mt-1" placeholder="e.g., 30"/>
              <p className="text-xs text-muted-foreground">Time of inactivity before automatic logout for security.</p>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6">
            <Button onClick={handleSaveSystemSettings} size="lg" className="ml-auto bg-purple-600 hover:bg-purple-700">Save System Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
