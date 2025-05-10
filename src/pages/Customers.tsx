
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash, Eye } from 'lucide-react';
import { customers, sales } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const Customers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get customer's purchase history
  const getCustomerPurchases = (customerId: string) => {
    return sales.filter(sale => sale.customerId === customerId);
  };
  
  // Dummy functions for CRUD operations
  const handleAddCustomer = () => {
    setShowAddDialog(false);
    toast({
      title: "Customer Added",
      description: "The customer has been successfully added.",
    });
  };
  
  const handleEditCustomer = (id: string) => {
    toast({
      title: "Edit Customer",
      description: `Editing customer with ID: ${id}`,
    });
  };
  
  const handleDeleteCustomer = (id: string) => {
    toast({
      title: "Delete Customer",
      description: `Customer with ID: ${id} would be deleted`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
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
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedCustomer(customer.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditCustomer(customer.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <h3 className="mt-2 text-lg font-medium">No customers found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="555-123-4567" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="customer@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input placeholder="123 Main St" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Customer Details Dialog */}
      <Dialog 
        open={selectedCustomer !== null} 
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedCustomer && (() => {
            const customer = customers.find(c => c.id === selectedCustomer);
            const customerPurchases = getCustomerPurchases(selectedCustomer);
            
            if (!customer) return null;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{customer.address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Customer Since</p>
                        <p className="font-medium">{new Date(customer.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Purchase History</h3>
                    
                    {customerPurchases.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customerPurchases.map((sale) => (
                              <TableRow key={sale.id}>
                                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                <TableCell>{sale.items.length}</TableCell>
                                <TableCell>${sale.total.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-gray-500">No purchase history found</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
