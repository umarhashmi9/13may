import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Truck, Edit, Trash, Phone, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
}

const mockSuppliers: Supplier[] = [
  { 
    id: 'sup1', 
    name: 'PharmaCare Inc.', 
    contact: 'John Miller', 
    phone: '555-123-4567', 
    email: 'contact@pharmacare.com',
    address: '123 Medical Ave, Health City',
    status: 'Active' as const
  },
  { 
    id: 'sup2', 
    name: 'MediSource Suppliers',
    contact: 'Lisa Johnson', 
    phone: '555-987-6543', 
    email: 'orders@medisource.com',
    address: '456 Medicine Rd, Wellness Town',
    status: 'Active' as const
  },
  { 
    id: 'sup3', 
    name: 'Global Health Products',
    contact: 'Robert Chen', 
    phone: '555-567-8901', 
    email: 'info@globalhp.com',
    address: '789 Remedy Blvd, Care City',
    status: 'Inactive' as const
  }
];

const Suppliers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
  });
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: `sup${suppliers.length + 1}`,
      ...formData,
      status: 'Active' as const
    };
    
    setSuppliers(prev => [...prev, newSupplier]);
    setShowAddDialog(false);
    resetForm();
    
    toast({
      title: "Supplier Added",
      description: "The supplier has been successfully added.",
    });
  };
  
  const handleEditSupplier = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      });
      setShowEditDialog(true);
    }
  };
  
  const handleSaveEdit = () => {
    if (!currentSupplier) return;
    
    const updatedSuppliers = suppliers.map(supplier => 
      supplier.id === currentSupplier.id 
        ? { ...supplier, ...formData }
        : supplier
    );
    
    setSuppliers(updatedSuppliers);
    setShowEditDialog(false);
    resetForm();
    setCurrentSupplier(null);
    
    toast({
      title: "Supplier Updated",
      description: "The supplier information has been successfully updated.",
    });
  };
  
  const handleConfirmDelete = () => {
    if (!currentSupplier) return;
    
    const updatedSuppliers = suppliers.filter(
      supplier => supplier.id !== currentSupplier.id
    );
    
    setSuppliers(updatedSuppliers);
    setShowDeleteDialog(false);
    setCurrentSupplier(null);
    
    toast({
      title: "Supplier Deleted",
      description: "The supplier has been successfully deleted.",
    });
  };
  
  const handleDeleteSupplier = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setCurrentSupplier(supplier);
      setShowDeleteDialog(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <Button onClick={() => {
          resetForm();
          setShowAddDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Suppliers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditSupplier(supplier.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredSuppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Truck className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No suppliers found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter supplier details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="PharmaCare Inc."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="John Miller"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 self-center" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="555-123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 self-center" />
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@supplier.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Medical Ave, Health City"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update supplier information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="PharmaCare Inc."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="John Miller"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 self-center" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="555-123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 self-center" />
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@supplier.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Medical Ave, Health City"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the supplier {currentSupplier?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Suppliers;
