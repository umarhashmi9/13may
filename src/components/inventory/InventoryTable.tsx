
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Edit, Trash, Package } from 'lucide-react';
import { Medicine } from "@/types/inventory";

interface InventoryTableProps {
  medicines: Medicine[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isPharmacist: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable = ({
  medicines,
  searchTerm,
  onSearchChange,
  isPharmacist,
  onEdit,
  onDelete
}: InventoryTableProps) => {
  const getStockStatus = (stock: number) => {
    if (stock <= 30) return 'status-pill status-low';
    if (stock <= 60) return 'status-pill status-medium';
    return 'status-pill status-good';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex md:w-auto w-full gap-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                {isPharmacist && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    <span className={getStockStatus(medicine.stock)}>
                      {medicine.stock}
                    </span>
                  </TableCell>
                  <TableCell>PKR {medicine.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </TableCell>
                  {isPharmacist && (
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(medicine.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(medicine.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {medicines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">No medicines found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
