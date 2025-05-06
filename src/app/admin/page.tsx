
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
import { Shield, Users, Settings2, FileText, PlusCircle, Edit, Trash2, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
import React, { useState } from "react";


const initialUsers = [
  { id: "usr001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2024-07-28 10:00 AM" },
  { id: "usr002", name: "Bob The Builder", email: "bob@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28 11:30 AM" },
  { id: "usr003", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive", lastLogin: "2024-07-25 09:15 AM" },
  { id: "usr004", name: "Diana Prince", email: "diana@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28 08:45 AM" },
];

const initialRoles = [
  { id: "admin", name: "Administrator", permissions: ["Manage Users", "Configure System", "View Audit Logs", "Full Control Access", "Define Roles"] },
  { id: "operator", name: "Traffic Operator", permissions: ["Monitor Feeds", "Manage Incidents", "Control Signals (Limited)", "View Analytics"] },
  { id: "viewer", name: "System Viewer", permissions: ["View Dashboard", "View Analytics (Read-only)", "View Camera Feeds"] },
];

const initialAuditLogs = [
  { timestamp: "2024-07-28 11:35 AM", user: "Alice Wonderland", action: "Signal override: Main St & 1st Ave", details: "Set to All Red due to accident reported (INC001)." },
  { timestamp: "2024-07-28 10:05 AM", user: "System", action: "New user created: Bob The Builder", details: "Role assigned: Operator" },
  { timestamp: "2024-07-27 15:20 PM", user: "Bob The Builder", action: "Incident resolved: INC005", details: "Marked as cleared. Notes: Fender bender, vehicles moved." },
  { timestamp: "2024-07-27 09:00 AM", user: "Alice Wonderland", action: "Role permissions updated: Viewer", details: "Added permission: View Camera Feeds" },
];

export default function AdminPanelPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs); 

  const handleAddUser = () => {
    toast({ title: "Add New User", description: "Functionality to add a new user would be here." });
    const newUser = { id: `usr00${users.length + 1}`, name: "New User", email: "newuser@example.com", role: "Viewer", status: "Pending", lastLogin: "Never" };
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const handleEditUser = (userId: string) => {
    toast({ title: "Edit User", description: `Editing user ${userId}. Form would appear here.` });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "User Deleted", description: `User ${userId} has been deleted.`, variant: "destructive" });
  };

  const handleAddRole = () => {
    toast({ title: "Add New Role", description: "Functionality to add a new role would be here." });
    const newRole = { id: `role${roles.length + 1}`, name: "New Custom Role", permissions: ["Basic View Only"] };
    setRoles(prevRoles => [newRole, ...prevRoles]);
  };

  const handleEditRole = (roleId: string) => {
    toast({ title: "Edit Role", description: `Editing role ${roleId}. Form would appear here.` });
  };
  
  const handleApplyFilters = () => {
    toast({ title: "Filters Applied", description: "Audit log filters have been applied." });
  };


  return (
    <div className="container mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <Shield className="h-10 w-10" />
          System Administration
        </h1>
        <p className="text-muted-foreground mt-1">Manage users, roles, and monitor system activities.</p>
      </header>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 bg-muted p-1 rounded-lg">
          <TabsTrigger value="users" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Users className="h-5 w-5"/> User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <Settings2 className="h-5 w-5"/> Role Configuration
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            <FileText className="h-5 w-5"/> Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-b p-6">
              <div>
                <CardTitle className="text-xl">User Accounts</CardTitle>
                <CardDescription>Manage user access and roles within the system.</CardDescription>
              </div>
              <Button onClick={handleAddUser} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell><Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Operator' ? 'secondary' : 'outline'} className="capitalize">{user.role}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Inactive' ? 'destructive' : 'secondary'} className={
                              user.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-400 border-green-500/30' :
                              user.status === 'Inactive' ? 'bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-400 border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400 border-yellow-500/30' 
                            }>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full" onClick={() => handleEditUser(user.id)} title={`Edit ${user.name}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 rounded-full" title={`Delete ${user.name}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete user <span className="font-semibold">{user.name}</span>? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">Delete User</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
             {users.length === 0 && <CardFooter className="p-6 justify-center text-muted-foreground">No users found.</CardFooter>}
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-b p-6">
              <div>
                <CardTitle className="text-xl">Role Configuration</CardTitle>
                <CardDescription>Define roles and their associated permissions.</CardDescription>
              </div>
               <Button onClick={handleAddRole} className="w-full sm:w-auto">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
               </Button>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <Card key={role.id} className="bg-card hover:shadow-lg transition-shadow duration-200 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-center text-lg">
                      {role.name}
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full h-8 w-8" onClick={() => handleEditRole(role.id)} title={`Edit ${role.name}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Permissions:</p>
                    <ul className="space-y-1.5 text-sm list-disc list-inside text-foreground">
                      {role.permissions.map(perm => <li key={perm} className="ml-2">{perm}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
            {roles.length === 0 && <CardFooter className="p-6 justify-center text-muted-foreground">No roles defined.</CardFooter>}
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-card border-b p-6">
              <CardTitle className="text-xl">System Audit Logs</CardTitle>
              <CardDescription>Track important system events and user actions for security and compliance.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
               <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center p-4 border rounded-lg bg-muted/50">
                <div className="relative flex-grow w-full sm:w-auto">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input type="search" placeholder="Search logs..." className="pl-10 w-full" />
                </div>
                <Input type="date" placeholder="Start Date" className="w-full sm:w-auto"/>
                <Input type="date" placeholder="End Date" className="w-full sm:w-auto"/>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All Users</SelectItem>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                     <SelectItem value="system">System Actions</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleApplyFilters} className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[180px]">User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-sm">{log.timestamp}</TableCell>
                        <TableCell className="text-sm">{log.user}</TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {auditLogs.length === 0 && <CardFooter className="p-6 justify-center text-muted-foreground">No audit logs found for the selected criteria.</CardFooter>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
