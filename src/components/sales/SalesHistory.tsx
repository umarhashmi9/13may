
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from 'lucide-react';

interface SalesHistoryProps {
  salesHistory: Array<{
    id: string;
    timestamp: Date;
    customer: string;
    total: number;
    paymentMethod: string;
    cart: Array<any>;
  }>;
  onPrintReceipt: (sale: any) => void;
}

const SalesHistory = ({ salesHistory, onPrintReceipt }: SalesHistoryProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No sales history available</TableCell>
                  </TableRow>
                ) : (
                  salesHistory.map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id.slice(-6)}</TableCell>
                      <TableCell>{new Date(sale.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{sale.customer || 'Walk-in'}</TableCell>
                      <TableCell>PKR {sale.total.toFixed(2)}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onPrintReceipt(sale)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesHistory;
