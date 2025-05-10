
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus } from 'lucide-react';
import { medicines } from '@/data/mockData';
import { useToast } from "@/components/ui/use-toast";

interface ProductListProps {
  onAddToCart: (medicine: typeof medicines[0]) => void;
}

const ProductList = ({ onAddToCart }: ProductListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof medicines>([]);

  useEffect(() => {
    setSearchResults(medicines);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(medicines);
      return;
    }
    
    const results = medicines.filter(
      medicine => medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 medicine.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input 
            placeholder="Search by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>${medicine.price.toFixed(2)}</TableCell>
                  <TableCell className={medicine.stock <= 10 ? "text-red-500 font-medium" : ""}>
                    {medicine.stock}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant={medicine.stock <= 0 ? "ghost" : "ghost"}
                      onClick={() => onAddToCart(medicine)}
                      disabled={medicine.stock <= 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {searchResults.length === 0 && (
        <div className="text-center py-8 border rounded-md">
          <Search className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No products found</h3>
          <p className="text-sm text-gray-500">Try searching for another product</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
