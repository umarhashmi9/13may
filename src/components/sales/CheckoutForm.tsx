
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from 'lucide-react';
import { customers } from '@/data/mockData';
import { useToast } from "@/components/ui/use-toast";

interface CheckoutFormProps {
  subtotal: number;
  tax: number;
  total: number;
  selectedCustomer: string;
  onCustomerChange: (value: string) => void;
  onCheckout: () => void;
}

const CheckoutForm = ({
  subtotal,
  tax,
  total,
  selectedCustomer,
  onCustomerChange,
  onCheckout
}: CheckoutFormProps) => {
  const {
    toast
  } = useToast();
  const [taxRate, setTaxRate] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Calculate updated tax and total based on tax rate and discount
  const calculatedTax = subtotal * (taxRate / 100);
  const calculatedDiscount = subtotal * (discount / 100);
  const calculatedTotal = subtotal + calculatedTax - calculatedDiscount;

  const handlePrint = () => {
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
            <p>Receipt #${Date.now().toString().slice(-6)}</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
          <div>
            <p>Customer: ${selectedCustomer === 'walk-in' ? 'Walk-in Customer' : customers.find(c => c.id === selectedCustomer)?.name || 'Unknown'}</p>
            <p>Payment: ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
          </div>
          <div class="item">
            <span>Subtotal:</span>
            <span>PKR ${subtotal.toFixed(2)}</span>
          </div>
          <div class="item">
            <span>Tax (${taxRate}%):</span>
            <span>PKR ${calculatedTax.toFixed(2)}</span>
          </div>
          ${discount > 0 ? `
          <div class="item">
            <span>Discount (${discount}%):</span>
            <span>PKR ${calculatedDiscount.toFixed(2)}</span>
          </div>` : ''}
          <div class="total">
            <span>Total:</span>
            <span>PKR ${calculatedTotal.toFixed(2)}</span>
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
        // Closing is optional and browser-dependent
        // printWindow.close();
      }, 500);
      toast({
        title: "Printing receipt",
        description: "The receipt has been sent to the printer"
      });
    } else {
      toast({
        title: "Print error",
        description: "Unable to open print window. Please check your popup blocker settings.",
        variant: "destructive"
      });
    }
  };

  // Update checkout handler to pass payment method data to parent
  const handleCheckout = () => {
    // We need to access the payment method in the parent component
    // so we'll use the parent's onCheckout function
    onCheckout();
  };

  return <div className="space-y-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <Select value={selectedCustomer} onValueChange={onCustomerChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walk-in">Walk-in Customer</SelectItem>
            {customers.map(customer => <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="payment">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="mobile">Mobile Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4 border-t space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>PKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Tax</span>
            <Input type="number" className="w-16 h-8 p-1 text-center" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} />
            <span>%</span>
          </div>
          <span>PKR {calculatedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Discount</span>
            <Input type="number" className="w-16 h-8 p-1 text-center" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
            <span>%</span>
          </div>
          <span>PKR {calculatedDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>PKR {calculatedTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="pt-4 space-y-2">
        <Button className="w-full" onClick={handleCheckout}>
          Checkout
        </Button>
        
      </div>
    </div>;
};

export default CheckoutForm;
