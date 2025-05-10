
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, RotateCcw, Package, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const customerReturns = [
  {
    id: 'ret-001',
    date: '2023-06-15',
    customer: 'John Smith',
    reason: 'Wrong medication',
    status: 'Processed',
    amount: 58.99,
    items: [
      { id: 'med-001', name: 'Paracetamol 500mg', quantity: 2, price: 15.50 },
      { id: 'med-002', name: 'Vitamin C 1000mg', quantity: 1, price: 27.99 }
    ]
  },
  {
    id: 'ret-002',
    date: '2023-06-12',
    customer: 'Sarah Johnson',
    reason: 'Item expired',
    status: 'Pending',
    amount: 42.50,
    items: [
      { id: 'med-003', name: 'Allergy Relief Tablets', quantity: 1, price: 42.50 }
    ]
  },
  {
    id: 'ret-003',
    date: '2023-06-10',
    customer: 'Michael Wong',
    reason: 'Customer changed mind',
    status: 'Processed',
    amount: 35.25,
    items: [
      { id: 'med-004', name: 'Blood Pressure Monitor', quantity: 1, price: 35.25 }
    ]
  }
];

const supplierReturns = [
  {
    id: 'sret-001',
    date: '2023-06-14',
    supplier: 'PharmaCare Inc.',
    reason: 'Damaged goods',
    status: 'In Transit',
    amount: 245.75,
    items: [
      { id: 'sup-001', name: 'Antibiotics Batch #4578', quantity: 5, price: 49.15 }
    ]
  },
  {
    id: 'sret-002',
    date: '2023-06-08',
    supplier: 'MediSource Suppliers',
    reason: 'Wrong product delivered',
    status: 'Processed',
    amount: 178.50,
    items: [
      { id: 'sup-002', name: 'Pain Relief Medication', quantity: 3, price: 59.50 }
    ]
  }
];

const mockMedicines = [
  { id: 'med-001', name: 'Paracetamol 500mg', stock: 150, price: 15.50 },
  { id: 'med-002', name: 'Vitamin C 1000mg', stock: 85, price: 27.99 },
  { id: 'med-003', name: 'Allergy Relief Tablets', stock: 42, price: 42.50 },
  { id: 'med-004', name: 'Blood Pressure Monitor', stock: 12, price: 35.25 },
  { id: 'med-005', name: 'Insulin Syringes', stock: 60, price: 18.75 }
];

const mockSuppliers = [
  { id: 'sup1', name: 'PharmaCare Inc.' },
  { id: 'sup2', name: 'MediSource Suppliers' },
  { id: 'sup3', name: 'Global Health Products' }
];

const CustomerReturnTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Filter returns based on search
  const filteredReturns = customerReturns.filter(ret => 
    ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddReturn = () => {
    setShowAddDialog(false);
    toast({
      title: "Return Recorded",
      description: "The customer return has been successfully processed.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Customer Return
        </Button>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search returns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => (
                  <TableRow key={ret.id}>
                    <TableCell className="font-medium">{ret.id}</TableCell>
                    <TableCell>{new Date(ret.date).toLocaleDateString()}</TableCell>
                    <TableCell>{ret.customer}</TableCell>
                    <TableCell>{ret.reason}</TableCell>
                    <TableCell>${ret.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ret.status === 'Processed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ret.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredReturns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <RotateCcw className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No returns found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Customer Return Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Process Customer Return</DialogTitle>
            <DialogDescription>
              Enter the details of the customer return
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Wong</SelectItem>
                    <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Return</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wrong">Wrong medication</SelectItem>
                  <SelectItem value="expired">Item expired</SelectItem>
                  <SelectItem value="changed">Customer changed mind</SelectItem>
                  <SelectItem value="adverse">Adverse reaction</SelectItem>
                  <SelectItem value="defective">Defective product</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium">Return Items</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No items added. Click "Add Item" to add products to the return.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Input placeholder="Any additional information about the return" />
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" id="refund" className="rounded border-gray-300 text-indigo-600" />
              <label htmlFor="refund" className="text-sm">Process refund for this return</label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddReturn}>Process Return</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SupplierReturnTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Filter returns based on search
  const filteredReturns = supplierReturns.filter(ret => 
    ret.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddReturn = () => {
    setShowAddDialog(false);
    toast({
      title: "Return Created",
      description: "The supplier return has been successfully created.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Supplier Return
        </Button>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search returns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Supplier Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => (
                  <TableRow key={ret.id}>
                    <TableCell className="font-medium">{ret.id}</TableCell>
                    <TableCell>{new Date(ret.date).toLocaleDateString()}</TableCell>
                    <TableCell>{ret.supplier}</TableCell>
                    <TableCell>{ret.reason}</TableCell>
                    <TableCell>${ret.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ret.status === 'Processed' 
                          ? 'bg-green-100 text-green-800' 
                          : ret.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ret.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredReturns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Truck className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No returns found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Supplier Return Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Supplier Return</DialogTitle>
            <DialogDescription>
              Enter the details of items to return to supplier
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Return</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged goods</SelectItem>
                  <SelectItem value="wrong">Wrong product delivered</SelectItem>
                  <SelectItem value="expired">Near expiry/expired</SelectItem>
                  <SelectItem value="recall">Product recall</SelectItem>
                  <SelectItem value="quality">Quality issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium">Return Items</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No items added. Click "Add Item" to add products to the return.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Input placeholder="Any additional information about the return" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddReturn}>Create Return</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Returns = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Returns Management</h1>
      </div>
      
      <Tabs defaultValue="customer">
        <TabsList>
          <TabsTrigger value="customer">Customer Returns</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="customer" className="pt-4">
          <CustomerReturnTab />
        </TabsContent>
        <TabsContent value="supplier" className="pt-4">
          <SupplierReturnTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Returns;
