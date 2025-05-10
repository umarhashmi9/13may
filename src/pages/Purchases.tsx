import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, FileText, Package, Trash } from "lucide-react";

const mockPurchases = [
  {
    id: "po-001",
    supplier: "PharmaCare Inc.",
    date: "2023-06-15",
    status: "Received",
    total: 1245.5,
    items: 12,
    orderItems: [
      {
        id: "item-001",
        name: "Paracetamol 500mg",
        quantity: 50,
        unitPrice: 5.99,
        total: 299.5,
      },
      {
        id: "item-002",
        name: "Amoxicillin 250mg",
        quantity: 30,
        unitPrice: 12.5,
        total: 375.0,
      },
      {
        id: "item-003",
        name: "Ibuprofen 400mg",
        quantity: 40,
        unitPrice: 7.25,
        total: 290.0,
      },
      {
        id: "item-004",
        name: "Cetirizine 10mg",
        quantity: 25,
        unitPrice: 8.99,
        total: 224.75,
      },
      {
        id: "item-005",
        name: "Vitamin D3 1000IU",
        quantity: 20,
        unitPrice: 2.8,
        total: 56.0,
      },
    ],
  },
  {
    id: "po-002",
    supplier: "MediSource Suppliers",
    date: "2023-06-10",
    status: "Pending",
    total: 876.25,
    items: 8,
    orderItems: [
      {
        id: "item-006",
        name: "Omeprazole 20mg",
        quantity: 35,
        unitPrice: 10.75,
        total: 376.25,
      },
      {
        id: "item-007",
        name: "Cough Syrup 100ml",
        quantity: 20,
        unitPrice: 13.25,
        total: 265.0,
      },
      {
        id: "item-008",
        name: "Diclofenac 50mg",
        quantity: 25,
        unitPrice: 9.4,
        total: 235.0,
      },
    ],
  },
  {
    id: "po-003",
    supplier: "Global Health Products",
    date: "2023-06-05",
    status: "Ordered",
    total: 2134.75,
    items: 15,
    orderItems: [
      {
        id: "item-009",
        name: "Insulin 10ml",
        quantity: 15,
        unitPrice: 65.0,
        total: 975.0,
      },
      {
        id: "item-010",
        name: "Aspirin 75mg",
        quantity: 100,
        unitPrice: 6.5,
        total: 650.0,
      },
      {
        id: "item-011",
        name: "Multivitamin Tablets",
        quantity: 50,
        unitPrice: 10.19,
        total: 509.5,
      },
    ],
  },
];

const mockSuppliers = [
  { id: "sup1", name: "PharmaCare Inc." },
  { id: "sup2", name: "MediSource Suppliers" },
  { id: "sup3", name: "Global Health Products" },
];

const NewPurchase = () => {
  // Get purchases from localStorage or use mock data
  const [purchases, setPurchases] = useState(() => {
    const storedPurchases = localStorage.getItem("purchases");
    return storedPurchases ? JSON.parse(storedPurchases) : mockPurchases;
  });
  const { toast } = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [orderItems, setOrderItems] = useState<
    Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>
  >([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unitPrice: 0,
  });

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please provide a name, quantity and price.",
        variant: "destructive",
      });
      return;
    }

    const itemId = `item-${Date.now()}`;
    const total = newItem.quantity * newItem.unitPrice;

    setOrderItems((prev) => [
      ...prev,
      {
        id: itemId,
        name: newItem.name,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total,
      },
    ]);

    setNewItem({ name: "", quantity: 1, unitPrice: 0 });
    setShowAddItemDialog(false);

    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the order.`,
    });
  };

  const removeItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreatePurchase = () => {
    if (!selectedSupplier) {
      toast({
        title: "Supplier Required",
        description: "Please select a supplier for this purchase order.",
        variant: "destructive",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one item to the purchase order.",
        variant: "destructive",
      });
      return;
    }

    // Find supplier name
    const supplier =
      mockSuppliers.find((s) => s.id === selectedSupplier)?.name || "Unknown";

    // Create new purchase order
    const newPurchase = {
      id: `po-${String(Date.now()).slice(-6)}`,
      supplier,
      date: orderDate,
      status: "Ordered",
      total: orderItems.reduce((sum, item) => sum + item.total, 0),
      items: orderItems.length,
      orderItems: orderItems,
    };

    // Update purchases list and save to localStorage
    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

    // Update inventory with new items
    const storedMedicines = localStorage.getItem("medicines");
    if (storedMedicines) {
      const medicines = JSON.parse(storedMedicines);

      // Add new items to inventory if they don't exist, or update stock if they do
      orderItems.forEach((item) => {
        const existingMedicine = medicines.find(
          (med) => med.name.toLowerCase() === item.name.toLowerCase(),
        );

        if (existingMedicine) {
          // Update existing medicine stock
          existingMedicine.stock += item.quantity;
        } else {
          // Add new medicine to inventory
          const newMedicine = {
            id: `med${String(Date.now() + Math.floor(Math.random() * 1000)).slice(-6)}`,
            name: item.name,
            category: "Imported",
            stock: item.quantity,
            price: item.unitPrice * 1.3, // Adding markup for retail
            expiryDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 2),
            )
              .toISOString()
              .split("T")[0], // Default 2 years expiry
            manufacturer: supplier,
          };
          medicines.push(newMedicine);
        }
      });

      // Save updated medicines to localStorage
      localStorage.setItem("medicines", JSON.stringify(medicines));
    }

    toast({
      title: "Purchase Order Created",
      description: `Purchase order with ${orderItems.length} items has been created successfully.`,
    });

    // Reset form
    setSelectedSupplier("");
    setOrderItems([]);
    setOrderDate(new Date().toISOString().split("T")[0]);
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
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order Date</label>
                <Input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <p className="text-sm text-gray-500">
                    Add items to your purchase order
                  </p>
                  <Button size="sm" onClick={() => setShowAddItemDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {orderItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Package className="h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium">
                      No items added yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Click "Add Item" to add products to your order
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Unit Price</th>
                          <th className="text-right py-2">Total</th>
                          <th className="py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="text-right py-2">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="text-right py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={3}
                            className="text-right font-medium py-2"
                          >
                            Total:
                          </td>
                          <td className="text-right font-bold py-2">
                            $
                            {orderItems
                              .reduce((sum, item) => sum + item.total, 0)
                              .toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleCreatePurchase}
                disabled={!selectedSupplier || orderItems.length === 0}
              >
                Create Purchase Order
              </Button>
            </div>

            {/* Add Item Dialog */}
            <Dialog
              open={showAddItemDialog}
              onOpenChange={setShowAddItemDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item</DialogTitle>
                  <DialogDescription>
                    Add an item to your purchase order
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <Input
                      placeholder="Medicine name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value) || 1,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.unitPrice}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            unitPrice: parseFloat(e.target.value) || 0,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddItemDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Save purchases to localStorage whenever they change
const useSavePurchases = (purchases: any[]) => {
  useEffect(() => {
    if (purchases && purchases.length > 0) {
      localStorage.setItem("purchases", JSON.stringify(purchases));
    }
  }, [purchases]);
};

const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchases, setPurchases] = useState(() => {
    const storedPurchases = localStorage.getItem("purchases");
    return storedPurchases ? JSON.parse(storedPurchases) : mockPurchases;
  });

  // Save purchases to localStorage whenever they change
  useSavePurchases(purchases);
  const [selectedPurchase, setSelectedPurchase] = useState<
    (typeof mockPurchases)[0] | null
  >(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filter purchases based on search
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const viewPurchaseDetails = (id: string) => {
    const purchase = purchases.find((p) => p.id === id);
    if (purchase) {
      setSelectedPurchase(purchase);
      setShowDetailsDialog(true);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Ordered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                    <TableCell>
                      {new Date(purchase.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{purchase.supplier}</TableCell>
                    <TableCell>{purchase.items}</TableCell>
                    <TableCell>${purchase.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(purchase.status)}`}
                      >
                        {purchase.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewPurchaseDetails(purchase.id)}
                      >
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

      {/* Purchase Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>
              {selectedPurchase && `Order ID: ${selectedPurchase.id}`}
            </DialogDescription>
          </DialogHeader>

          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">{selectedPurchase.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedPurchase.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedPurchase.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">
                    ${selectedPurchase.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPurchase.orderItems ? (
                        selectedPurchase.orderItems.map((item, index) => (
                          <tr key={item.id || index} className="border-t">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-right">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t">
                          <td
                            colSpan={4}
                            className="px-4 py-2 text-center text-gray-500"
                          >
                            No item details available
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr className="border-t">
                        <td
                          colSpan={3}
                          className="px-4 py-2 text-right font-medium"
                        >
                          Total:
                        </td>
                        <td className="px-4 py-2 text-right font-bold">
                          ${selectedPurchase.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Button onClick={() => setActiveTab("new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
