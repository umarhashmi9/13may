
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { medicines } from '@/data/mockData';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventoryFilters } from '@/components/inventory/InventoryFilters';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { AddMedicineDialog } from '@/components/inventory/AddMedicineDialog';
import { ImportDialog } from '@/components/inventory/ImportDialog';

const Inventory = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  const isAdmin = currentUser?.role === 'admin';
  const isPharmacist = currentUser?.role === 'pharmacist' || isAdmin;
  
  const categories = Array.from(new Set(medicines.map(medicine => medicine.category)));
  
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMedicine = () => {
    setShowAddDialog(false);
    toast({
      title: "Medicine Added",
      description: "The medicine has been successfully added to inventory.",
    });
  };
  
  const handleEditMedicine = (id: string) => {
    toast({
      title: "Edit Medicine",
      description: `Editing medicine with ID: ${id}`,
    });
  };
  
  const handleDeleteMedicine = (id: string) => {
    toast({
      title: "Delete Medicine",
      description: `Medicine with ID: ${id} would be deleted`,
    });
  };
  
  const exportToExcel = () => {
    let csvContent = "ID,Name,Category,Stock,Price,Expiry Date\n";
    filteredMedicines.forEach(medicine => {
      csvContent += `${medicine.id},${medicine.name},${medicine.category},${medicine.stock},${medicine.price},${medicine.expiryDate}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Inventory data has been exported to CSV file.",
    });
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `Selected file: ${file.name}`,
      });
    }
  };
  
  const importFromExcel = () => {
    setShowImportDialog(false);
    toast({
      title: "Import Processing",
      description: "Your inventory data is being processed and will be updated shortly.",
    });
  };
  
  return (
    <div className="space-y-6">
      <InventoryHeader
        isPharmacist={isPharmacist}
        onImport={() => setShowImportDialog(true)}
        onExport={exportToExcel}
        onAdd={() => setShowAddDialog(true)}
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        <InventoryFilters
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
        
        <div className="flex-1">
          <InventoryTable
            medicines={filteredMedicines}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isPharmacist={isPharmacist}
            onEdit={handleEditMedicine}
            onDelete={handleDeleteMedicine}
          />
        </div>
      </div>
      
      <AddMedicineDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        categories={categories}
        onAdd={handleAddMedicine}
      />
      
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onFileSelect={handleFileInput}
        onImport={importFromExcel}
      />
    </div>
  );
};

export default Inventory;
