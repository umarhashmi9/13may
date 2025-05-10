
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, FileText, Package } from 'lucide-react';

const mockPurchases = [
  {
    id: 'po-001',
    supplier: 'PharmaCare Inc.',
    date: '2023-06-15',
    status: 'Received',
    total: 1245.50,
    items: 12
  },
  {
    id: 'po-002',
    supplier: 'MediSource Suppliers',
    date: '2023-06-10',
    status: 'Pending',
    total: 876.25,
    items: 8
  },
  {
    id: 'po-003',
    supplier: 'Global Health Products',
    date: '2023-06-05',
    status: 'Ordered',
    total: 2134.75,
    items: 15
  }
];

const mockSuppliers = [
  { id: 'sup1', name: 'PharmaCare Inc.' },
  { id: 'sup2', name: 'MediSource Suppliers' },
  { id: 'sup3', name: 'Global Health Products' }
];

const NewPurchase = () => {
  const { toast } = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const handleCreatePurchase = () => {
    toast({
      title: "Purchase Order Created",
      description: "The purchase order has been created successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
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
                <label className="text-sm font-medium">Order Date</label>
                <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <p className="text-sm text-gray-500">Add items to your purchase order</p>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-8">
                  <Package className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No items added yet</h3>
                  <p className="text-sm text-gray-500">Click "Add Item" to add products to your order</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleCreatePurchase}>Create Purchase Order</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter purchases based on search
  const filteredPurchases = mockPurchases.filter(purchase => 
    purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Received':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ordered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
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
                  <TableHead>PO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>{purchase.supplier}</TableCell>
                    <TableCell>{purchase.items}</TableCell>
                    <TableCell>${purchase.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Purchases = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>
      
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="new">New Purchase Order</TabsTrigger>
          <TabsTrigger value="history">Purchase History</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="pt-4">
          <NewPurchase />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <PurchaseHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Purchases;
