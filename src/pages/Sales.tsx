
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Save, FileText, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { medicines } from '@/data/mockData';
import ProductList from '@/components/sales/ProductList';
import CartDisplay from '@/components/sales/CartDisplay';
import CheckoutForm from '@/components/sales/CheckoutForm';
import SalesHistory from '@/components/sales/SalesHistory';

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface DraftSale {
  id: string;
  customer: string;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
}

interface CompletedSale {
  id: string;
  customer: string;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
  paymentMethod: string;
}

const NewSale = () => {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drafts, setDrafts] = useState<DraftSale[]>([]);
  const [salesHistory, setSalesHistory] = useState<CompletedSale[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Load drafts and sales history from localStorage when component mounts
  useEffect(() => {
    const savedDrafts = localStorage.getItem('saleDrafts');
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (error) {
        console.error('Error parsing drafts:', error);
      }
    }
    
    const savedSales = localStorage.getItem('salesHistory');
    if (savedSales) {
      try {
        setSalesHistory(JSON.parse(savedSales));
      } catch (error) {
        console.error('Error parsing sales history:', error);
      }
    }
  }, []);

  // Save drafts to localStorage whenever drafts state changes
  useEffect(() => {
    localStorage.setItem('saleDrafts', JSON.stringify(drafts));
  }, [drafts]);
  
  // Save sales history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
  }, [salesHistory]);

  // Function to clear the cart and start a new sale
  const startNewSale = () => {
    if (cart.length > 0) {
      if (window.confirm("Are you sure you want to start a new sale? Current cart items will be lost.")) {
        setCart([]);
        setSelectedCustomer('');
        toast({
          title: "New Sale Started",
          description: "The cart has been cleared for a new sale."
        });
      }
    } else {
      toast({
        title: "New Sale",
        description: "Ready to start a new sale."
      });
    }
  };

  const addToCart = (medicine: typeof medicines[0]) => {
    if (medicine.stock <= 0) {
      toast({
        title: "Out of stock",
        description: `${medicine.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }
    const existingItemIndex = cart.findIndex(item => item.medicineId === medicine.id);
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].total = updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].price;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        medicineId: medicine.id,
        name: medicine.name,
        quantity: 1,
        price: medicine.price,
        total: medicine.price
      };
      setCart([...cart, newItem]);
    }
    toast({
      title: "Added to cart",
      description: `${medicine.name} has been added to the cart`
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity,
          total: item.price * quantity
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const subtotal = calculateSubtotal();
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Update checkout function to add the sale to sales history
  const checkout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to the cart before checkout",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new completed sale
    const newSale: CompletedSale = {
      id: `sale-${Date.now()}`,
      customer: selectedCustomer,
      cart: [...cart],
      subtotal,
      tax,
      total,
      timestamp: new Date(),
      paymentMethod: paymentMethod
    };
    
    // Add to sales history
    setSalesHistory(prev => [newSale, ...prev]);
    
    // Print receipt automatically
    handlePrintReceipt(newSale);
    
    toast({
      title: "Sale completed",
      description: `Total amount: PKR ${total.toFixed(2)}`
    });
    
    setCart([]);
    setSelectedCustomer('');
    setShowDrafts(false);
  };

  // Function to print receipt for a specific sale
  const handlePrintReceipt = (sale: CompletedSale) => {
    // Create a printable version of the receipt
    const printContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 300px; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total { font-weight: bold; border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MedPulse Pharmacy</h2>
            <p>123 Health Street</p>
            <p>Receipt #${sale.id.slice(-6)}</p>
            <p>${new Date(sale.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p>Customer: ${sale.customer || 'Walk-in Customer'}</p>
            <p>Payment: ${sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}</p>
          </div>
          ${sale.cart.map(item => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>PKR ${item.total.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="item">
            <span>Subtotal:</span>
            <span>PKR ${sale.subtotal.toFixed(2)}</span>
          </div>
          <div class="item">
            <span>Tax (5%):</span>
            <span>PKR ${sale.tax.toFixed(2)}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>PKR ${sale.total.toFixed(2)}</span>
          </div>
          <div class="footer">
            <p>Thank you for choosing MedPulse Pharmacy!</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Save the current sale as draft 
  const saveSaleDraft = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "No items in the cart to save",
        variant: "destructive"
      });
      return;
    }

    const draftSale: DraftSale = {
      id: `draft-${Date.now()}`,
      customer: selectedCustomer,
      cart: [...cart],
      subtotal,
      tax,
      total,
      timestamp: new Date()
    };

    setDrafts([...drafts, draftSale]);
    
    toast({
      title: "Sale saved as draft",
      description: `Sale with ${cart.length} items has been saved as draft`
    });
    
    // Clear cart after saving as draft
    setCart([]);
    setSelectedCustomer('');
  };

  // Function to show the drafts list
  const toggleShowDrafts = () => {
    setShowDrafts(!showDrafts);
  };

  // Load draft sale
  const loadDraft = (draft: DraftSale) => {
    setCart([...draft.cart]);
    setSelectedCustomer(draft.customer);
    setShowDrafts(false);
    
    toast({
      title: "Draft loaded",
      description: `Draft sale with ${draft.cart.length} items has been loaded.`
    });
  };

  // Delete draft sale
  const deleteDraft = (draftId: string) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
    
    toast({
      title: "Draft deleted",
      description: "Draft sale has been deleted."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={toggleShowDrafts}>
            <FileText className="mr-2 h-4 w-4" />
            Show Drafts
          </Button>
        </div>
      </div>
      
      {showDrafts ? (
        <Card>
          <CardHeader>
            <CardTitle>Draft Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {drafts.length === 0 ? (
              <p>No draft sales available.</p>
            ) : (
              <div className="space-y-4">
                {drafts.map(draft => (
                  <div key={draft.id} className="border p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Date: {new Date(draft.timestamp).toLocaleString()}</span>
                      <span>Items: {draft.cart.length}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Customer: {draft.customer || 'Walk-in'}</span>
                      <span>Total: PKR {draft.total.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => loadDraft(draft)}>Load</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteDraft(draft.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProductList onAddToCart={addToCart} />
                <CartDisplay cart={cart} onUpdateQuantity={updateItemQuantity} onRemoveItem={removeFromCart} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm 
                subtotal={subtotal} 
                tax={tax} 
                total={total} 
                selectedCustomer={selectedCustomer} 
                onCustomerChange={setSelectedCustomer} 
                onCheckout={checkout}
              />
              
              {/* Add Save as Draft button at the bottom */}
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={saveSaleDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const Sales = () => {
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('new-sale');
  
  // Load sales history from localStorage when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      const savedSales = localStorage.getItem('salesHistory');
      if (savedSales) {
        try {
          setSalesHistory(JSON.parse(savedSales));
        } catch (error) {
          console.error('Error parsing sales history:', error);
        }
      }
    }
  }, [activeTab]);
  
  // Function to handle printing receipts from the history tab
  const handlePrintFromHistory = (sale: any) => {
    // Create a printable version of the receipt
    const printContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 300px; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total { font-weight: bold; border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MedPulse Pharmacy</h2>
            <p>123 Health Street</p>
            <p>Receipt #${sale.id.slice(-6)}</p>
            <p>${new Date(sale.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p>Customer: ${sale.customer || 'Walk-in Customer'}</p>
            <p>Payment: ${sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}</p>
          </div>
          ${sale.cart.map((item: any) => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>PKR ${item.total.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="item">
            <span>Subtotal:</span>
            <span>PKR ${sale.subtotal.toFixed(2)}</span>
          </div>
          <div class="item">
            <span>Tax (5%):</span>
            <span>PKR ${sale.tax.toFixed(2)}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>PKR ${sale.total.toFixed(2)}</span>
          </div>
          <div class="footer">
            <p>Thank you for choosing MedPulse Pharmacy!</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Management</h1>
      </div>
      
      <Tabs defaultValue="new-sale" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new-sale">New Sale</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
        </TabsList>
        <TabsContent value="new-sale" className="pt-4">
          <NewSale />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <SalesHistory salesHistory={salesHistory} onPrintReceipt={handlePrintFromHistory} />
        </TabsContent>
      </Tabs>
    </div>;
};

export default Sales;
