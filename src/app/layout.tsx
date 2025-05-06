
'use client'; 

import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; 
import { HomeIcon as LucideHomeIcon, BarChart3, Video, MapPin, SlidersHorizontal, AlertTriangle, Settings, Shield, LogOut, TrafficCone, LayoutDashboard } from 'lucide-react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation'; 
import React, { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [pageTitle, setPageTitle] = useState('TrafficWise');


  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default", 
    });
  };

  const pageTitlesMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard Overview',
    '/analytics': 'Analytics Portal',
    '/cameras': 'Live Camera Feeds',
    '/map': 'Interactive Congestion Map',
    '/control': 'Signal Control Interface',
    '/incidents': 'Incident Reports',
    '/settings': 'User Settings',
    '/admin': 'System Administration',
  };
  
  useEffect(() => {
    const title = pageTitlesMap[pathname] || 'TrafficWise';
    setPageTitle(title);
    if (typeof window !== 'undefined') {
      document.title = `TrafficWise - ${title}`;
    }
  }, [pathname]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content="Intelligent traffic management system powered by AI." />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <SidebarProvider defaultOpen>
          <Sidebar 
            side="left" 
            collapsible="icon" 
            className="border-r border-sidebar-border shadow-md"
            variant="sidebar" 
          >
            <SidebarHeader className="p-4 border-b border-sidebar-border">
              <Link href="/" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-md">
                <TrafficCone className="w-8 h-8 text-sidebar-primary group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7" />
                <h1 className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">TrafficWise</h1>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2 flex-grow">
              <SidebarMenu className="space-y-1">
                {[
                  { href: "/", label: "Home", icon: LucideHomeIcon, tooltip: "Home Page" },
                  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard Overview" },
                  { href: "/analytics", label: "Analytics", icon: BarChart3, tooltip: "Analytics Portal" },
                  { href: "/cameras", label: "Cameras", icon: Video, tooltip: "Live Camera Feeds" },
                  { href: "/map", label: "Map", icon: MapPin, tooltip: "Congestion Map" },
                  { href: "/control", label: "Control", icon: SlidersHorizontal, tooltip: "Control Interface" },
                  { href: "/incidents", label: "Incidents", icon: AlertTriangle, tooltip: "Incident Reports" },
                ].map(item => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton tooltip={item.tooltip} isActive={pathname === item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs uppercase tracking-wider text-sidebar-foreground/70 px-2 mb-1">
                  Management
                </SidebarGroupLabel>
                <SidebarMenu className="space-y-1">
                   <SidebarMenuItem>
                     <Link href="/settings" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="General Settings" isActive={pathname === '/settings'}>
                        <Settings className="h-5 w-5"/>
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </SidebarMenuButton>
                     </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <Link href="/admin" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Admin Panel" isActive={pathname === '/admin'}>
                        <Shield className="h-5 w-5"/>
                        <span className="group-data-[collapsible=icon]:hidden">Admin</span>
                        </SidebarMenuButton>
                     </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

            </SidebarContent>
            <SidebarFooter className="p-3 border-t border-sidebar-border">
              <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
                    <AvatarImage src="https://picsum.photos/seed/user_profile/40/40" data-ai-hint="user avatar" alt="User Avatar" />
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">JD</AvatarFallback>
                  </Avatar>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium text-sidebar-foreground">John Doe</p>
                    <p className="text-xs text-sidebar-foreground/70">Operator</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden rounded-full h-8 w-8" onClick={handleLogout} title="Log Out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col bg-background">
            {/* Ensure header z-index is consistent and lower than potential overlays like mobile sidebar */}
            <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden text-muted-foreground hover:text-foreground" />
                <h2 className="text-xl font-semibold text-foreground">
                  {pageTitle}
                </h2>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

