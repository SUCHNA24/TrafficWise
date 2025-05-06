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
import { Shield, Users, Settings2, FileText, PlusCircle, Edit, Trash2, Search, Filter, PackageSearch, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useMemo, useEffect } from "react";


type User = { 
  id: string; 
  name: string; 
  email: string; 
  role: "Admin" | "Operator" | "Viewer" | string; // Allow string for custom roles
  status: "Active" | "Inactive" | "Pending"; 
  lastLogin: string; 
};
type Role = { id: string; name: string; permissions: string[] };
type AuditLog = { timestamp: string; user: string; action: string; details: string };


const initialUsers: User[] = [
  { id: "usr001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2024-07-28 10:00 AM" },
  { id: "usr002", name: "Bob The Builder", email: "bob@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28 11:30 AM" },
  { id: "usr003", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive", lastLogin: "2024-07-25 09:15 AM" },
  { id: "usr004", name: "Diana Prince", email: "diana@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28 08:45 AM" },
  { id: "usr005", name: "Edward Scissorhands", email: "edward@example.com", role: "Viewer", status: "Active", lastLogin: "2024-07-29 09:00 AM" },
  { id: "usr006", name: "Fiona Gallagher", email: "fiona@example.com", role: "Operator", status: "Inactive", lastLogin: "2024-07-20 14:00 PM" },
];

const allPermissions = [
  "Manage Users", "Configure System", "View Audit Logs", "Full Control Access", 
  "Define Roles", "Monitor Feeds", "Manage Incidents", "Control Signals (Limited)", 
  "View Analytics", "View Dashboard", "View Analytics (Read-only)", "View Camera Feeds",
  "Generate Reports", "System Backup", "Security Configuration"
];


const initialRoles: Role[] = [
  { id: "admin", name: "Administrator", permissions: ["Manage Users", "Configure System", "View Audit Logs", "Full Control Access", "Define Roles"] },
  { id: "operator", name: "Traffic Operator", permissions: ["Monitor Feeds", "Manage Incidents", "Control Signals (Limited)", "View Analytics"] },
  { id: "viewer", name: "System Viewer", permissions: ["View Dashboard", "View Analytics (Read-only)", "View Camera Feeds"] },
];

const initialAuditLogs: AuditLog[] = [
  { timestamp: "2024-07-29 09:30 AM", user: "Alice Wonderland", action: "User 'Edward Scissorhands' created", details: "Role assigned: Viewer" },
  { timestamp: "2024-07-28 11:35 AM", user: "Alice Wonderland", action: "Signal override: Main St &amp; 1st Ave", details: "Set to All Red due to accident reported (INC001)." },
  { timestamp: "2024-07-28 10:05 AM", user: "System", action: "New user created: Bob The Builder", details: "Role assigned: Operator" },
  { timestamp: "2024-07-27 15:20 PM", user: "Bob The Builder", action: "Incident resolved: INC005", details: "Marked as cleared. Notes: Fender bender, vehicles moved." },
  { timestamp: "2024-07-27 09:00 AM", user: "Alice Wonderland", action: "Role permissions updated: Viewer", details: "Added permission: View Camera Feeds" },
  { timestamp: "2024-07-26 14:00 PM", user: "System", action: "Database backup completed successfully", details: "Full system backup initiated by schedule." },
  { timestamp: "2024-07-26 10:15 AM", user: "Diana Prince", action: "Camera feed adjusted: HWY 101 Cam 3", details: "Zoom and pan settings updated for better incident view." },
];

const ITEMS_PER_PAGE = 5;

export default function AdminPanelPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs); 
  
  // User management state
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({ name: "", email: "", role: "Viewer", status: "Pending"});

  // Role management state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState<Partial<Role>>({ name: "", permissions: []});

  // Audit log state
  const [auditSearchTerm, setAuditSearchTerm] = useState("");
  const [auditStartDate, setAuditStartDate] = useState("");
  const [auditEndDate, setAuditEndDate] = useState("");
  const [auditUserFilter, setAuditUserFilter] = useState("all_users");
  const [auditCurrentPage, setAuditCurrentPage] = useState(1);


  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [users, userSearchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (userCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, userCurrentPage]);
  const userTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Memoized filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const start = auditStartDate ? new Date(auditStartDate) : null;
      const end = auditEndDate ? new Date(auditEndDate) : null;

      if (start && logDate &lt; start) return false;
      if (end) { // Adjust end date to include the whole day
        const dayAfterEnd = new Date(end);
        dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
        if (logDate >= dayAfterEnd) return false;
      }
      if (auditUserFilter !== "all_users" && log.user !== auditUserFilter && (auditUserFilter === "System" ? log.user !== "System" : users.find(u=>u.id === auditUserFilter)?.name !== log.user)) return false;
      if (auditSearchTerm && !(log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) || log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()))) return false;
      return true;
    });
  }, [auditLogs, auditSearchTerm, auditStartDate, auditEndDate, auditUserFilter, users]);

  const paginatedAuditLogs = useMemo(() => {
    const startIndex = (auditCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAuditLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAuditLogs, auditCurrentPage]);
  const auditTotalPages = Math.ceil(filteredAuditLogs.length / ITEMS_PER_PAGE);


  const handleOpenUserModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm(user);
    } else {
      setEditingUser(null);
      setUserForm({ name: "", email: "", role: "Viewer", status: "Pending" });
    }
    setIsUserModalOpen(true);
  };

  const handleUserFormChange = (e: React.ChangeEvent&lt;HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.role) {
        toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive"});
        return;
    }
    if (editingUser) {
      setUsers(prevUsers => prevUsers.map(u => u.id === editingUser.id ? { ...editingUser, ...userForm } as User : u));
      toast({ title: "User Updated", description: `User ${userForm.name} has been updated.` });
    } else {
      const newUser: User = { 
        id: `usr00${users.length + 1}`, 
        name: userForm.name!, 
        email: userForm.email!, 
        role: userForm.role! as User['role'], 
        status: userForm.status || "Pending", 
        lastLogin: "Never" 
      };
      setUsers(prevUsers => [newUser, ...prevUsers]);
      toast({ title: "User Added", description: `User ${newUser.name} has been added.` });
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "User Deleted", description: `User ${userId} has been deleted.`, variant: "destructive" });
  };

  const handleOpenRoleModal = (role: Role | null = null) => {
    if (role) {
      setEditingRole(role);
      setRoleForm(role);
    } else {
      setEditingRole(null);
      setRoleForm({ name: "", permissions: [] });
    }
    setIsRoleModalOpen(true);
  };
  
  const handleRoleFormChange = (e: React.ChangeEvent&lt;HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name || !roleForm.permissions || roleForm.permissions.length === 0) {
        toast({ title: "Error", description: "Please provide a role name and select at least one permission.", variant: "destructive"});
        return;
    }
    if (editingRole) {
      setRoles(prevRoles => prevRoles.map(r => r.id === editingRole.id ? { ...editingRole, ...roleForm } as Role : r));
      toast({ title: "Role Updated", description: `Role ${roleForm.name} has been updated.` });
    } else {
      const newRole: Role = { 
        id: `role${roles.length + 1}`, 
        name: roleForm.name!, 
        permissions: roleForm.permissions!
      };
      setRoles(prevRoles => [newRole, ...prevRoles]);
      toast({ title: "Role Added", description: `Role ${newRole.name} has been added.` });
    }
    setIsRoleModalOpen(false);
  };
  
  const handleApplyAuditFilters = () => {
    setAuditCurrentPage(1); // Reset to first page when filters change
    toast({ title: "Filters Applied", description: "Audit log filters have been applied." });
  };


  return (
    &lt;div className="container mx-auto py-8">
      &lt;header className="mb-10">
        &lt;h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          &lt;Shield className="h-10 w-10" />
          System Administration
        &lt;/h1>
        &lt;p className="text-muted-foreground mt-1">Manage users, roles, and monitor system activities.&lt;/p>
      &lt;/header>

      &lt;Tabs defaultValue="users" className="w-full">
        &lt;TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 bg-muted p-1 rounded-lg">
          &lt;TabsTrigger value="users" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            &lt;Users className="h-5 w-5"/> User Management
          &lt;/TabsTrigger>
          &lt;TabsTrigger value="roles" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            &lt;Settings2 className="h-5 w-5"/> Role Configuration
          &lt;/TabsTrigger>
          &lt;TabsTrigger value="audit" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
            &lt;FileText className="h-5 w-5"/> Audit Logs
          &lt;/TabsTrigger>
        &lt;/TabsList>

        &lt;TabsContent value="users">
          &lt;Card className="shadow-xl overflow-hidden">
            &lt;CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-b p-6">
              &lt;div>
                &lt;CardTitle className="text-xl">User Accounts&lt;/CardTitle>
                &lt;CardDescription>Manage user access and roles within the system.&lt;/CardDescription>
              &lt;/div>
              &lt;div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                &lt;div className="relative flex-grow">
                   &lt;Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   &lt;Input type="search" placeholder="Search users..." className="pl-10 w-full" value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)}/>
                &lt;/div>
                &lt;Button onClick={() => handleOpenUserModal()} className="w-full sm:w-auto">
                  &lt;PlusCircle className="mr-2 h-4 w-4" /> Add New User
                &lt;/Button>
              &lt;/div>
            &lt;/CardHeader>
            &lt;CardContent className="p-0">
              &lt;div className="overflow-x-auto">
                &lt;Table>
                  &lt;TableHeader>
                    &lt;TableRow>
                      &lt;TableHead>Name&lt;/TableHead>
                      &lt;TableHead>Email&lt;/TableHead>
                      &lt;TableHead>Role&lt;/TableHead>
                      &lt;TableHead>Status&lt;/TableHead>
                      &lt;TableHead className="hidden md:table-cell">Last Login&lt;/TableHead>
                      &lt;TableHead className="text-right">Actions&lt;/TableHead>
                    &lt;/TableRow>
                  &lt;/TableHeader>
                  &lt;TableBody>
                    {paginatedUsers.map((user) => (
                      &lt;TableRow key={user.id} className="hover:bg-muted/50">
                        &lt;TableCell className="font-medium">{user.name}&lt;/TableCell>
                        &lt;TableCell className="text-muted-foreground">{user.email}&lt;/TableCell>
                        &lt;TableCell>&lt;Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Operator' ? 'secondary' : 'outline'} className="capitalize">{user.role}&lt;/Badge>&lt;/TableCell>
                        &lt;TableCell>
                          &lt;Badge variant={user.status === 'Active' ? 'default' : user.status === 'Inactive' ? 'destructive' : 'secondary'} className={
                              user.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-400 border-green-500/30' :
                              user.status === 'Inactive' ? 'bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-400 border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-400 border-yellow-500/30' 
                            }>
                            {user.status}
                          &lt;/Badge>
                        &lt;/TableCell>
                        &lt;TableCell className="hidden md:table-cell text-muted-foreground">{user.lastLogin}&lt;/TableCell>
                        &lt;TableCell className="text-right space-x-1">
                          &lt;Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full" onClick={() => handleOpenUserModal(user)} title={`Edit ${user.name}`}>
                            &lt;Edit className="h-4 w-4" />
                          &lt;/Button>
                          &lt;AlertDialog>
                            &lt;AlertDialogTrigger asChild>
                              &lt;Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 rounded-full" title={`Delete ${user.name}`}>
                                &lt;Trash2 className="h-4 w-4" />
                              &lt;/Button>
                            &lt;/AlertDialogTrigger>
                            &lt;AlertDialogContent>
                              &lt;AlertDialogHeader>
                                &lt;AlertDialogTitle>Confirm Deletion&lt;/AlertDialogTitle>
                                &lt;AlertDialogDescription>
                                  Are you sure you want to delete user &lt;span className="font-semibold">{user.name}&lt;/span>? This action cannot be undone.
                                &lt;/AlertDialogDescription>
                              &lt;/AlertDialogHeader>
                              &lt;AlertDialogFooter>
                                &lt;AlertDialogCancel>Cancel&lt;/AlertDialogCancel>
                                &lt;AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">Delete User&lt;/AlertDialogAction>
                              &lt;/AlertDialogFooter>
                            &lt;/AlertDialogContent>
                          &lt;/AlertDialog>
                        &lt;/TableCell>
                      &lt;/TableRow>
                    ))}
                  &lt;/TableBody>
                &lt;/Table>
              &lt;/div>
            &lt;/CardContent>
            {paginatedUsers.length === 0 && 
                &lt;CardFooter className="p-10 text-center text-muted-foreground">
                    &lt;div className="mx-auto">
                        &lt;PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        &lt;h3 className="text-xl font-semibold mb-2">No Users Found&lt;/h3>
                        &lt;p>No users match your current search criteria.&lt;/p>
                    &lt;/div>
                &lt;/CardFooter>
            }
            {userTotalPages > 1 && (
            &lt;CardFooter className="p-4 border-t flex justify-end">
                &lt;div className="flex items-center gap-2">
                &lt;Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserCurrentPage(p => Math.max(1, p - 1))}
                    disabled={userCurrentPage === 1}
                >
                    Previous
                &lt;/Button>
                &lt;span className="text-sm text-muted-foreground">
                    Page {userCurrentPage} of {userTotalPages}
                &lt;/span>
                &lt;Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserCurrentPage(p => Math.min(userTotalPages, p + 1))}
                    disabled={userCurrentPage === userTotalPages}
                >
                    Next
                &lt;/Button>
                &lt;/div>
            &lt;/CardFooter>
            )}
          &lt;/Card>
        &lt;/TabsContent>

        &lt;TabsContent value="roles">
          &lt;Card className="shadow-xl">
            &lt;CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-b p-6">
              &lt;div>
                &lt;CardTitle className="text-xl">Role Configuration&lt;/CardTitle>
                &lt;CardDescription>Define roles and their associated permissions.&lt;/CardDescription>
              &lt;/div>
               &lt;Button onClick={() => handleOpenRoleModal()} className="w-full sm:w-auto">
                 &lt;PlusCircle className="mr-2 h-4 w-4" /> Add New Role
               &lt;/Button>
            &lt;/CardHeader>
            &lt;CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                &lt;Card key={role.id} className="bg-card hover:shadow-lg transition-shadow duration-200 flex flex-col">
                  &lt;CardHeader className="pb-3">
                    &lt;CardTitle className="flex justify-between items-center text-lg">
                      {role.name}
                      &lt;Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full h-8 w-8" onClick={() => handleOpenRoleModal(role)} title={`Edit ${role.name}`}>
                        &lt;Edit className="h-4 w-4" />
                      &lt;/Button>
                    &lt;/CardTitle>
                  &lt;/CardHeader>
                  &lt;CardContent className="flex-grow">
                    &lt;p className="text-sm font-medium mb-2 text-muted-foreground">Permissions ({role.permissions.length}):&lt;/p>
                    &lt;ul className="space-y-1.5 text-sm list-disc list-inside text-foreground max-h-32 overflow-y-auto pr-2">
                      {role.permissions.map(perm => &lt;li key={perm} className="ml-2 truncate" title={perm}>{perm}&lt;/li>)}
                    &lt;/ul>
                  &lt;/CardContent>
                   &lt;CardFooter className="pt-3 border-t mt-auto">
                        &lt;Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleOpenRoleModal(role)}>View/Edit Permissions&lt;/Button>
                   &lt;/CardFooter>
                &lt;/Card>
              ))}
            &lt;/CardContent>
            {roles.length === 0 && 
                &lt;CardFooter className="p-10 text-center text-muted-foreground">
                    &lt;div className="mx-auto">
                        &lt;PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        &lt;h3 className="text-xl font-semibold mb-2">No Roles Defined&lt;/h3>
                        &lt;p>Create roles to manage user permissions effectively.&lt;/p>
                    &lt;/div>
                &lt;/CardFooter>
            }
          &lt;/Card>
        &lt;/TabsContent>

        &lt;TabsContent value="audit">
          &lt;Card className="shadow-xl overflow-hidden">
            &lt;CardHeader className="bg-card border-b p-6">
              &lt;CardTitle className="text-xl">System Audit Logs&lt;/CardTitle>
              &lt;CardDescription>Track important system events and user actions for security and compliance.&lt;/CardDescription>
            &lt;/CardHeader>
            &lt;CardContent className="p-6">
               &lt;div className="flex flex-col sm:flex-row gap-3 mb-6 items-center p-4 border rounded-lg bg-muted/50">
                &lt;div className="relative flex-grow w-full sm:w-auto">
                   &lt;Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   &lt;Input type="search" placeholder="Search logs..." className="pl-10 w-full" value={auditSearchTerm} onChange={(e) => setAuditSearchTerm(e.target.value)} />
                &lt;/div>
                &lt;Input type="date" placeholder="Start Date" className="w-full sm:w-auto" value={auditStartDate} onChange={(e) => setAuditStartDate(e.target.value)} />
                &lt;Input type="date" placeholder="End Date" className="w-full sm:w-auto" value={auditEndDate} onChange={(e) => setAuditEndDate(e.target.value)} />
                &lt;Select value={auditUserFilter} onValueChange={setAuditUserFilter}>
                  &lt;SelectTrigger className="w-full sm:w-[180px]">
                    &lt;SelectValue placeholder="Filter by User" />
                  &lt;/SelectTrigger>
                  &lt;SelectContent>
                    &lt;SelectItem value="all_users">All Users&lt;/SelectItem>
                    {users.map(u => &lt;SelectItem key={u.id} value={u.name}>{u.name}&lt;/SelectItem>)}
                     &lt;SelectItem value="System">System Actions&lt;/SelectItem>
                  &lt;/SelectContent>
                &lt;/Select>
                &lt;Button variant="outline" onClick={handleApplyAuditFilters} className="w-full sm:w-auto">
                  &lt;Filter className="mr-2 h-4 w-4" /> Apply Filters
                &lt;/Button>
              &lt;/div>
              &lt;div className="overflow-x-auto">
                &lt;Table>
                  &lt;TableHeader>
                    &lt;TableRow>
                      &lt;TableHead className="w-[180px]">Timestamp&lt;/TableHead>
                      &lt;TableHead className="w-[180px]">User&lt;/TableHead>
                      &lt;TableHead>Action&lt;/TableHead>
                      &lt;TableHead>Details&lt;/TableHead>
                    &lt;/TableRow>
                  &lt;/TableHeader>
                  &lt;TableBody>
                    {paginatedAuditLogs.map((log, index) => (
                      &lt;TableRow key={index} className="hover:bg-muted/50">
                        &lt;TableCell className="font-medium text-sm">{log.timestamp}&lt;/TableCell>
                        &lt;TableCell className="text-sm">{log.user}&lt;/TableCell>
                        &lt;TableCell className="text-sm">{log.action}&lt;/TableCell>
                        &lt;TableCell className="text-xs text-muted-foreground">{log.details}&lt;/TableCell>
                      &lt;/TableRow>
                    ))}
                  &lt;/TableBody>
                &lt;/Table>
              &lt;/div>
            &lt;/CardContent>
            {paginatedAuditLogs.length === 0 && 
                &lt;CardFooter className="p-10 text-center text-muted-foreground">
                     &lt;div className="mx-auto">
                        &lt;PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        &lt;h3 className="text-xl font-semibold mb-2">No Audit Logs Found&lt;/h3>
                        &lt;p>No audit logs match your current filter criteria.&lt;/p>
                    &lt;/div>
                &lt;/CardFooter>
            }
            {auditTotalPages > 1 && (
            &lt;CardFooter className="p-4 border-t flex justify-end">
                &lt;div className="flex items-center gap-2">
                &lt;Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuditCurrentPage(p => Math.max(1, p - 1))}
                    disabled={auditCurrentPage === 1}
                >
                    Previous
                &lt;/Button>
                &lt;span className="text-sm text-muted-foreground">
                    Page {auditCurrentPage} of {auditTotalPages}
                &lt;/span>
                &lt;Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuditCurrentPage(p => Math.min(auditTotalPages, p + 1))}
                    disabled={auditCurrentPage === auditTotalPages}
                >
                    Next
                &lt;/Button>
                &lt;/div>
            &lt;/CardFooter>
            )}
          &lt;/Card>
        &lt;/TabsContent>
      &lt;/Tabs>

      {/* User Modals */}
      &lt;Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        &lt;DialogContent>
          &lt;DialogHeader>
            &lt;DialogTitle>{editingUser ? "Edit User" : "Add New User"}&lt;/DialogTitle>
            &lt;DialogDescription>
              {editingUser ? "Update the details for this user." : "Enter the details for the new user."}
            &lt;/DialogDescription>
          &lt;/DialogHeader>
          &lt;form onSubmit={handleUserFormSubmit} className="space-y-4 py-4">
            &lt;div>
              &lt;Label htmlFor="userName">Full Name&lt;/Label>
              &lt;Input id="userName" name="name" value={userForm.name} onChange={handleUserFormChange} placeholder="e.g., Jane Doe" required />
            &lt;/div>
            &lt;div>
              &lt;Label htmlFor="userEmail">Email Address&lt;/Label>
              &lt;Input id="userEmail" name="email" type="email" value={userForm.email} onChange={handleUserFormChange} placeholder="e.g., jane.doe@example.com" required />
            &lt;/div>
            &lt;div>
              &lt;Label htmlFor="userRole">Role&lt;/Label>
              &lt;Select name="role" value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value as User['role']}))} required>
                &lt;SelectTrigger id="userRole">&lt;SelectValue placeholder="Select a role" />&lt;/SelectTrigger>
                &lt;SelectContent>
                  {roles.map(r => &lt;SelectItem key={r.id} value={r.name}>{r.name}&lt;/SelectItem>)}
                &lt;/SelectContent>
              &lt;/Select>
            &lt;/div>
             {editingUser && (
                &lt;div>
                    &lt;Label htmlFor="userStatus">Status&lt;/Label>
                    &lt;Select name="status" value={userForm.status} onValueChange={(value) => setUserForm(prev => ({ ...prev, status: value as User['status']}))}>
                        &lt;SelectTrigger id="userStatus">&lt;SelectValue placeholder="Select status" />&lt;/SelectTrigger>
                        &lt;SelectContent>
                        &lt;SelectItem value="Active">Active&lt;/SelectItem>
                        &lt;SelectItem value="Inactive">Inactive&lt;/SelectItem>
                        &lt;SelectItem value="Pending">Pending&lt;/SelectItem>
                        &lt;/SelectContent>
                    &lt;/Select>
                &lt;/div>
            )}
            &lt;DialogFooter>
              &lt;Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel&lt;/Button>
              &lt;Button type="submit">{editingUser ? "Save Changes" : "Add User"}&lt;/Button>
            &lt;/DialogFooter>
          &lt;/form>
        &lt;/DialogContent>
      &lt;/Dialog>

        {/* Role Modals */}
      &lt;Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        &lt;DialogContent className="sm:max-w-lg">
          &lt;DialogHeader>
            &lt;DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}&lt;/DialogTitle>
            &lt;DialogDescription>
              {editingRole ? "Update the role name and permissions." : "Define a new role and its permissions."}
            &lt;/DialogDescription>
          &lt;/DialogHeader>
          &lt;form onSubmit={handleRoleFormSubmit} className="space-y-4 py-4">
            &lt;div>
              &lt;Label htmlFor="roleName">Role Name&lt;/Label>
              &lt;Input id="roleName" name="name" value={roleForm.name} onChange={handleRoleFormChange} placeholder="e.g., Traffic Analyst" required />
            &lt;/div>
            &lt;div>
              &lt;Label>Permissions&lt;/Label>
              &lt;div className="space-y-2 mt-1 p-3 border rounded-md max-h-60 overflow-y-auto">
                {allPermissions.map(perm => (
                  &lt;div key={perm} className="flex items-center space-x-2">
                    &lt;Checkbox 
                      id={`perm-${perm.replace(/\s+/g, '-')}`} 
                      checked={roleForm.permissions?.includes(perm)}
                      onCheckedChange={(checked) => {
                        const currentPermissions = roleForm.permissions || [];
                        const newPermissions = checked 
                          ? [...currentPermissions, perm]
                          : currentPermissions.filter(p => p !== perm);
                        setRoleForm(prev => ({ ...prev, permissions: newPermissions }));
                      }}
                    />
                    &lt;Label htmlFor={`perm-${perm.replace(/\s+/g, '-')}`} className="font-normal">{perm}&lt;/Label>
                  &lt;/div>
                ))}
              &lt;/div>
               &lt;p className="text-xs text-muted-foreground mt-1">Select the permissions this role should have.&lt;/p>
            &lt;/div>
            &lt;DialogFooter>
              &lt;Button type="button" variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancel&lt;/Button>
              &lt;Button type="submit">{editingRole ? "Save Role" : "Add Role"}&lt;/Button>
            &lt;/DialogFooter>
          &lt;/form>
        &lt;/DialogContent>
      &lt;/Dialog>

    &lt;/div>
  );
}
