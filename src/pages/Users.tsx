import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash, User, Mail, Phone, Lock, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const Users = () => {
  const { toast } = useToast();
  const { allUsers, addUser, updateUser, deleteUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Form states for adding and editing users
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'cashier' as 'admin' | 'cashier' | 'pharmacist',
    status: 'active' as 'active' | 'inactive',
    joined: new Date().toISOString().split('T')[0],
    password: '',
    confirmPassword: '',
    sendEmail: true,
    avatarUrl: null as string | null
  });
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Filter users based on search and role
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  // Handle form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle role selection
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'admin' | 'cashier' | 'pharmacist' }));
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      status: 'active' as 'active' | 'inactive',
      joined: new Date().toISOString().split('T')[0],
      password: '',
      confirmPassword: '',
      sendEmail: true,
      avatarUrl: null
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  // Load user data for editing
  const loadUserForEdit = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status || 'active' as 'active' | 'inactive',
        joined: user.joinDate || new Date().toISOString().split('T')[0],
        password: '',
        confirmPassword: '',
        sendEmail: false,
        avatarUrl: user.avatar
      });
      setPreviewUrl(user.avatar || null);
      setSelectedUser(userId);
      setShowEditDialog(true);
    }
  };
  
  // Handle add user
  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    const newUser = {
      id: `usr-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status as 'active' | 'inactive',
      joinDate: formData.joined,
      avatar: previewUrl
    };
    
    addUser(newUser);
    
    setShowAddDialog(false);
    resetFormData();
    
    toast({
      title: "User Added",
      description: "The user has been successfully added.",
    });
  };
  
  // Handle edit user
  const handleEditUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    const user = allUsers.find(u => u.id === formData.id);
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status as 'active' | 'inactive',
      avatar: previewUrl || user.avatar
    };
    
    updateUser(updatedUser);
    
    setShowEditDialog(false);
    resetFormData();
    
    toast({
      title: "User Updated",
      description: "The user has been successfully updated.",
    });
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser);
      
      setShowDeleteDialog(false);
      setSelectedUser(null);
      
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
    }
  };
  
  const handleResetPassword = () => {
    setShowResetDialog(false);
    toast({
      title: "Password Reset",
      description: "A password reset email has been sent to the user.",
    });
  };
  
  const getUserStatusBadgeClass = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => {
          resetFormData();
          setShowAddDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Staff Members</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getUserStatusBadgeClass(user.status || 'active')}`}>
                        {user.status === 'active' || !user.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowResetDialog(true);
                        }}
                        title="Reset Password"
                      >
                        <Lock className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => loadUserForEdit(user.id)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowDeleteDialog(true);
                        }}
                        title="Delete User"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <User className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No users found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for staff member
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-20 w-20 cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Preview" />
                  ) : (
                    <AvatarFallback className="bg-gray-100">
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                  <Upload className="h-3 w-3 text-white" />
                </div>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="John Doe" 
                value={formData.name} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="user@medpulse.com" 
                    value={formData.email} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="555-123-4567" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="status" 
                  checked={formData.status === 'active'} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex">
                  <Lock className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Switch 
                id="sendEmail" 
                checked={formData.sendEmail} 
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendEmail: checked }))}
              />
              <Label htmlFor="sendEmail">Send welcome email with login instructions</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-20 w-20 cursor-pointer" onClick={() => document.getElementById('edit-avatar-upload')?.click()}>
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Preview" />
                  ) : (
                    <AvatarFallback className="bg-gray-100">
                      {formData.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer" onClick={() => document.getElementById('edit-avatar-upload')?.click()}>
                  <Upload className="h-3 w-3 text-white" />
                </div>
                <input 
                  id="edit-avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                name="name"
                placeholder="John Doe" 
                value={formData.name} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="edit-email" 
                    name="email" 
                    type="email" 
                    placeholder="user@medpulse.com" 
                    value={formData.email} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="edit-phone" 
                    name="phone" 
                    placeholder="555-123-4567" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-status" 
                  checked={formData.status === 'active'} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                />
                <Label htmlFor="edit-status">Active</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <div className="flex">
                  <Lock className="h-4 w-4 mr-2 self-center" />
                  <Input 
                    id="edit-password" 
                    name="password" 
                    type="password" 
                    placeholder="Leave blank to keep current" 
                    value={formData.password} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
                <Input 
                  id="edit-confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to the user's email address.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to reset the password for this user?<br/>
              {selectedUser && (
                <span className="font-medium">
                  {allUsers.find(user => user.id === selectedUser)?.name} ({allUsers.find(user => user.id === selectedUser)?.email})
                </span>
              )}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The user will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this user?<br/>
              {selectedUser && (
                <span className="font-medium">
                  {allUsers.find(user => user.id === selectedUser)?.name} ({allUsers.find(user => user.id === selectedUser)?.email})
                </span>
              )}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
