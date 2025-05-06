
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
  // Client-side formatted date
  formattedLastLogin?: string;
};
type Role = { id: string; name: string; permissions: string[] };
type AuditLog = { 
  timestamp: string; // ISO String
  user: string; 
  action: string; 
  details: string;
  // Client-side formatted date
  formattedTimestamp?: string;
};


const initialUsers: User[] = [
  { id: "usr001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2024-07-28T10:00:00.000Z" },
  { id: "usr002", name: "Bob The Builder", email: "bob@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28T11:30:00.000Z" },
  { id: "usr003", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive", lastLogin: "2024-07-25T09:15:00.000Z" },
  { id: "usr004", name: "Diana Prince", email: "diana@example.com", role: "Operator", status: "Active", lastLogin: "2024-07-28T08:45:00.000Z" },
  { id: "usr005", name: "Edward Scissorhands", email: "edward@example.com", role: "Viewer", status: "Active", lastLogin: "2024-07-29T09:00:00.000Z" },
  { id: "usr006", name: "Fiona Gallagher", email: "fiona@example.com", role: "Operator", status: "Inactive", lastLogin: "2024-07-20T14:00:00.000Z" },
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
  { timestamp: "2024-07-29T09:30:00.000Z", user: "Alice Wonderland", action: "User 'Edward Scissorhands' created", details: "Role assigned: Viewer" },
  { timestamp: "2024-07-28T11:35:00.000Z", user: "Alice Wonderland", action: "Signal override: Main St & 1st Ave", details: "Set to All Red due to accident reported (INC001)." },
  { timestamp: "2024-07-28T10:05:00.000Z", user: "System", action: "New user created: Bob The Builder", details: "Role assigned: Operator" },
  { timestamp: "2024-07-27T15:20:00.000Z", user: "Bob The Builder", action: "Incident resolved: INC005", details: "Marked as cleared. Notes: Fender bender, vehicles moved." },
  { timestamp: "2024-07-27T09:00:00.000Z", user: "Alice Wonderland", action: "Role permissions updated: Viewer", details: "Added permission: View Camera Feeds" },
  { timestamp: "2024-07-26T14:00:00.000Z", user: "System", action: "Database backup completed successfully", details: "Full system backup initiated by schedule." },
  { timestamp: "2024-07-26T10:15:00.000Z", user: "Diana Prince", action: "Camera feed adjusted: HWY 101 Cam 3", details: "Zoom and pan settings updated for better incident view." },
];

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  // Check if it's 'Never' for lastLogin
  if (dateString === "Never") return "Never";
  try {
    return new Date(dateString).toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
    });
  } catch (e) {
    return dateString; // return original if parsing fails
  }
};


export default function AdminPanelPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]); 
  
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

  useEffect(() => {
    setUsers(initialUsers.map(user => ({ ...user, formattedLastLogin: formatDate(user.lastLogin) })));
    setAuditLogs(initialAuditLogs.map(log => ({ ...log, formattedTimestamp: formatDate(log.timestamp) })));
  }, []);

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

      if (start && logDate < start) return false;
      if (end) { 
        const dayAfterEnd = new Date(end);
        dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
        if (logDate >= dayAfterEnd) return false;
      }
      if (auditUserFilter !== "all_users" && log.user !== auditUserFilter && (auditUserFilter === "System" ? log.user !== "System" : users.find(u=>u.name === auditUserFilter)?.name !== log.user)) return false;
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

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.role) {
        toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive"});
        return;
    }
    const now = new Date().toISOString();
    if (editingUser) {
      const updatedUser = { ...editingUser, ...userForm, lastLogin: editingUser.lastLogin, formattedLastLogin: formatDate(editingUser.lastLogin) } as User;
      setUsers(prevUsers => prevUsers.map(u => u.id === editingUser.id ? updatedUser : u));
      toast({ title: "User Updated", description: `User ${userForm.name} has been updated.` });
    } else {
      const newUser: User = { 
        id: `usr00${users.length + 1}`, 
        name: userForm.name!, 
        email: userForm.email!, 
        role: userForm.role! as User['role'], 
        status: userForm.status || "Pending", 
        lastLogin: "Never",
        formattedLastLogin: "Never"
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
  
  const handleRoleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-grow">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input type="search" placeholder="Search users..." className="pl-10 w-full" value={userSearchTerm} onChange={(e) => { setUserSearchTerm(e.target.value); setUserCurrentPage(1);}}/>
                </div>
                <Button onClick={() => handleOpenUserModal()} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                </Button>
              </div>
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
                    {paginatedUsers.map((user) => (
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
                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{user.formattedLastLogin}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full" onClick={() => handleOpenUserModal(user)} title={`Edit ${user.name}`}>
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
            {paginatedUsers.length === 0 && 
                <CardFooter className="p-10 text-center text-muted-foreground">
                    <div className="mx-auto">
                        <PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
                        <p>No users match your current search criteria.</p>
                    </div>
                </CardFooter>
            }
            {userTotalPages > 1 && (
            <CardFooter className="p-4 border-t flex justify-end">
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserCurrentPage(p => Math.max(1, p - 1))}
                    disabled={userCurrentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {userCurrentPage} of {userTotalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserCurrentPage(p => Math.min(userTotalPages, p + 1))}
                    disabled={userCurrentPage === userTotalPages}
                >
                    Next
                </Button>
                </div>
            </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border-b p-6">
              <div>
                <CardTitle className="text-xl">Role Configuration</CardTitle>
                <CardDescription>Define roles and their associated permissions.</CardDescription>
              </div>
               <Button onClick={() => handleOpenRoleModal()} className="w-full sm:w-auto">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
               </Button>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <Card key={role.id} className="bg-card hover:shadow-lg transition-shadow duration-200 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-center text-lg">
                      {role.name}
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 rounded-full h-8 w-8" onClick={() => handleOpenRoleModal(role)} title={`Edit ${role.name}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Permissions ({role.permissions.length}):</p>
                    <ul className="space-y-1.5 text-sm list-disc list-inside text-foreground max-h-32 overflow-y-auto pr-2">
                      {role.permissions.map(perm => <li key={perm} className="ml-2 truncate" title={perm}>{perm}</li>)}
                    </ul>
                  </CardContent>
                   <CardFooter className="pt-3 border-t mt-auto">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleOpenRoleModal(role)}>View/Edit Permissions</Button>
                   </CardFooter>
                </Card>
              ))}
            </CardContent>
            {roles.length === 0 && 
                <CardFooter className="p-10 text-center text-muted-foreground">
                    <div className="mx-auto">
                        <PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        <h3 className="text-xl font-semibold mb-2">No Roles Defined</h3>
                        <p>Create roles to manage user permissions effectively.</p>
                    </div>
                </CardFooter>
            }
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
                   <Input type="search" placeholder="Search logs..." className="pl-10 w-full" value={auditSearchTerm} onChange={(e) => {setAuditSearchTerm(e.target.value); setAuditCurrentPage(1);}} />
                </div>
                <Input type="date" placeholder="Start Date" className="w-full sm:w-auto" value={auditStartDate} onChange={(e) => setAuditStartDate(e.target.value)} />
                <Input type="date" placeholder="End Date" className="w-full sm:w-auto" value={auditEndDate} onChange={(e) => setAuditEndDate(e.target.value)} />
                <Select value={auditUserFilter} onValueChange={(value) => {setAuditUserFilter(value); setAuditCurrentPage(1);}}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All Users</SelectItem>
                    {users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                     <SelectItem value="System">System Actions</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleApplyAuditFilters} className="w-full sm:w-auto">
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
                    {paginatedAuditLogs.map((log, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-xs">{log.formattedTimestamp}</TableCell>
                        <TableCell className="text-sm">{log.user}</TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {paginatedAuditLogs.length === 0 && 
                <CardFooter className="p-10 text-center text-muted-foreground">
                     <div className="mx-auto">
                        <PackageSearch className="h-16 w-16 mx-auto mb-4 text-primary/30"/>
                        <h3 className="text-xl font-semibold mb-2">No Audit Logs Found</h3>
                        <p>No audit logs match your current filter criteria.</p>
                    </div>
                </CardFooter>
            }
            {auditTotalPages > 1 && (
            <CardFooter className="p-4 border-t flex justify-end">
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuditCurrentPage(p => Math.max(1, p - 1))}
                    disabled={auditCurrentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {auditCurrentPage} of {auditTotalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuditCurrentPage(p => Math.min(auditTotalPages, p + 1))}
                    disabled={auditCurrentPage === auditTotalPages}
                >
                    Next
                </Button>
                </div>
            </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Modals */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update the details for this user." : "Enter the details for the new user."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserFormSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="userName">Full Name</Label>
              <Input id="userName" name="name" value={userForm.name || ""} onChange={handleUserFormChange} placeholder="e.g., Jane Doe" required />
            </div>
            <div>
              <Label htmlFor="userEmail">Email Address</Label>
              <Input id="userEmail" name="email" type="email" value={userForm.email || ""} onChange={handleUserFormChange} placeholder="e.g., jane.doe@example.com" required />
            </div>
            <div>
              <Label htmlFor="userRole">Role</Label>
              <Select name="role" value={userForm.role || ""} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value as User['role']}))} required>
                <SelectTrigger id="userRole"><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             {editingUser && (
                <div>
                    <Label htmlFor="userStatus">Status</Label>
                    <Select name="status" value={userForm.status || ""} onValueChange={(value) => setUserForm(prev => ({ ...prev, status: value as User['status']}))}>
                        <SelectTrigger id="userStatus"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingUser ? "Save Changes" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

        {/* Role Modals */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Update the role name and permissions." : "Define a new role and its permissions."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRoleFormSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input id="roleName" name="name" value={roleForm.name || ""} onChange={handleRoleFormChange} placeholder="e.g., Traffic Analyst" required />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 mt-1 p-3 border rounded-md max-h-60 overflow-y-auto">
                {allPermissions.map(perm => (
                  <div key={perm} className="flex items-center space-x-2">
                    <Checkbox 
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
                    <Label htmlFor={`perm-${perm.replace(/\s+/g, '-')}`} className="font-normal">{perm}</Label>
                  </div>
                ))}
              </div>
               <p className="text-xs text-muted-foreground mt-1">Select the permissions this role should have.</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingRole ? "Save Role" : "Add Role"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

