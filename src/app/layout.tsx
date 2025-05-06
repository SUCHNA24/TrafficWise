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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { Home, BarChart3, Video, Map, SlidersHorizontal, AlertTriangle, Settings, Shield, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle'; // Assuming you'll create this

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TrafficWise - AI Traffic Management',
  description: 'Intelligent traffic management system powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SidebarProvider defaultOpen>
          <Sidebar side="left" collapsible="icon" className="border-r">
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7">
                  <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.026A.75.75 0 003 6.728V19.5A.75.75 0 003.75 20.25h16.5A.75.75 0 0021 19.5V6.728a.75.75 0 00-.366-.702l-8.256-4.424zM12 7.5a.75.75 0 01.75.75v3.19l2.72 1.21a.75.75 0 01-.67 1.34l-2.72-1.21a.75.75 0 01-.75-.75V8.25A.75.75 0 0112 7.5zm-3.75.75a.75.75 0 000 1.5h.372l1.328-.59V8.25a.75.75 0 00-.75-.75H8.25zm1.5.932L8.422 9.75h1.328v1.018l1.328-.59V9.182zm3 1.193a.75.75 0 000 1.5h.372l1.328-.59V10.375a.75.75 0 00-.75-.75h-.95z" />
                </svg>
                <h1 className="text-2xl font-semibold text-primary group-data-[collapsible=icon]:hidden">TrafficWise</h1>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Dashboard" isActive>
                      <Home />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/analytics" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Analytics">
                      <BarChart3 />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/cameras" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Camera Feeds">
                      <Video />
                      <span>Camera Feeds</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/map" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Congestion Map">
                      <Map />
                      <span>Congestion Map</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/control" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Control Interface">
                      <SlidersHorizontal />
                      <span>Control Interface</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <Link href="/incidents" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Incident Reports">
                      <AlertTriangle />
                      <span>Incident Reports</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>

              <SidebarGroup className="mt-auto">
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Settings</SidebarGroupLabel>
                <SidebarMenu>
                   <SidebarMenuItem>
                     <Link href="/settings" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="General Settings">
                        <Settings />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </SidebarMenuButton>
                     </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <Link href="/admin" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Admin Panel">
                        <Shield />
                        <span className="group-data-[collapsible=icon]:hidden">Admin</span>
                        </SidebarMenuButton>
                     </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
              <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/40/40" data-ai-hint="user avatar" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Operator</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
                  <LogOut />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}