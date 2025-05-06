
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shield, Users, Settings2, FileText, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox"; // No longer used
// import { Label } from "@/components/ui/label"; // No longer used
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
  { id: "admin", name: "Admin", permissions: ["Manage Users", "Configure System", "View Audit Logs", "Full Control Access"] },
  { id: "operator", name: "Operator", permissions: ["Monitor Feeds", "Manage Incidents", "Control Signals (Limited)"] },
  { id: "viewer", name: "Viewer", permissions: ["View Dashboard", "View Analytics (Read-only)"] },
];

const initialAuditLogs = [
  { timestamp: "2024-07-28 11:35 AM", user: "Alice Wonderland", action: "Signal override: Main St & 1st Ave", details: "Set to All Red due to accident." },
  { timestamp: "2024-07-28 10:05 AM", user: "System", action: "New user created: Bob The Builder", details: "Role: Operator" },
  { timestamp: "2024-07-27 15:20 PM", user: "Bob The Builder", action: "Incident resolved: INC005", details: "Marked as cleared." },
];

export default function AdminPanelPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs); // In a real app, this would be filtered based on state

  const handleAddUser = () => {
    toast({ title: "Add New User", description: "Functionality to add a new user would be here." });
    // Mock adding a user
    const newUser = { id: `usr00${users.length + 1}`, name: "New User", email: "new@example.com", role: "Viewer", status: "Pending", lastLogin: "Never" };
    setUsers(prevUsers => [...prevUsers, newUser]);
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
     // Mock adding a role
    const newRole = { id: `role00${roles.length + 1}`, name: "New Role", permissions: ["Basic View"] };
    setRoles(prevRoles => [...prevRoles, newRole]);
  };

  const handleEditRole = (roleId: string) => {
    toast({ title: "Edit Role", description: `Editing role ${roleId}. Form would appear here.` });
  };
  
  const handleApplyFilters = () => {
    toast({ title: "Filters Applied", description: "Audit log filters have been applied." });
    // Actual filtering logic would go here
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
        <Shield className="h-8 w-8" />
        Admin Panel
      </h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2"><Users/> User Management</TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2"><Settings2/> Role Configuration</TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2"><FileText/> Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>Manage user access and roles within the system.</CardDescription>
              </div>
              <Button onClick={handleAddUser}><PlusCircle className="mr-2 h-4 w-4" /> Add New User</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                      <TableCell><span className={user.status === 'Active' ? 'text-green-600' : user.status === 'Inactive' ? 'text-red-600' : 'text-yellow-500' }>{user.status}</span></TableCell>
                      <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                      <TableCell className="space-x-1">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" onClick={() => handleEditUser(user.id)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete user {user.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Role Configuration</CardTitle>
                <CardDescription>Define roles and their permissions.</CardDescription>
              </div>
               <Button onClick={handleAddRole}><PlusCircle className="mr-2 h-4 w-4" /> Add New Role</Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <Card key={role.id} className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-lg">
                      {role.name}
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 h-7 w-7" onClick={() => handleEditRole(role.id)}><Edit className="h-4 w-4" /></Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                    <ul className="space-y-1 text-xs list-disc list-inside text-muted-foreground">
                      {role.permissions.map(perm => <li key={perm}>{perm}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>Track important system events and user actions.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex gap-2 mb-4">
                <Input type="date" placeholder="Start Date" className="w-auto"/>
                <Input type="date" placeholder="End Date" className="w-auto"/>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All Users</SelectItem>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                     <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleApplyFilters}>Apply Filters</Button>
              </div>
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
                    <TableRow key={index}>
                      <TableCell className="font-medium">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
