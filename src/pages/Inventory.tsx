import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { medicines as initialMedicines } from "@/data/mockData";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddMedicineDialog } from "@/components/inventory/AddMedicineDialog";
import { ImportDialog } from "@/components/inventory/ImportDialog";
import { EditMedicineDialog } from "@/components/inventory/EditMedicineDialog";
import { DeleteMedicineDialog } from "@/components/inventory/DeleteMedicineDialog";
import { Medicine } from "@/types/inventory";

const Inventory = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Initialize medicines from mock data
  useEffect(() => {
    // In a real app, this would fetch from an API or database
    const storedMedicines = localStorage.getItem("medicines");
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    } else {
      setMedicines(initialMedicines);
      localStorage.setItem("medicines", JSON.stringify(initialMedicines));
    }
  }, []);

  const isAdmin = currentUser?.role === "admin";
  const isPharmacist = currentUser?.role === "pharmacist" || isAdmin;

  const categories = Array.from(
    new Set(medicines.map((medicine) => medicine.category)),
  );

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Save medicines to localStorage whenever they change
  useEffect(() => {
    if (medicines.length > 0) {
      localStorage.setItem("medicines", JSON.stringify(medicines));
    }
  }, [medicines]);

  const handleAddMedicine = (newMedicine: Omit<Medicine, "id">) => {
    // Generate a unique ID
    const id = `med${String(Date.now()).slice(-6)}`;

    // Create the new medicine with the generated ID
    const medicineToAdd: Medicine = {
      id,
      ...newMedicine,
    };

    // Add the new medicine to the list
    setMedicines((prev) => [...prev, medicineToAdd]);
    setShowAddDialog(false);

    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been successfully added to inventory.`,
    });
  };

  const handleEditMedicine = (id: string) => {
    const medicine = medicines.find((med) => med.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setShowEditDialog(true);
    }
  };

  const handleSaveMedicine = (
    id: string,
    updatedMedicine: Partial<Medicine>,
  ) => {
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) =>
        med.id === id ? { ...med, ...updatedMedicine } : med,
      ),
    );
    setShowEditDialog(false);
    toast({
      title: "Medicine Updated",
      description: `${updatedMedicine.name} has been successfully updated.`,
    });
  };

  const handleDeleteMedicine = (id: string) => {
    const medicine = medicines.find((med) => med.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeleteMedicine = (id: string) => {
    setMedicines((prevMedicines) =>
      prevMedicines.filter((med) => med.id !== id),
    );
    toast({
      title: "Medicine Deleted",
      description: `Medicine has been successfully removed from inventory.`,
    });
  };

  const exportToExcel = () => {
    // Create CSV header
    let csvContent =
      "ID,Name,Category,Stock,Price,Expiry Date,Manufacturer,Description\n";

    // Add data rows
    filteredMedicines.forEach((medicine) => {
      // Escape fields that might contain commas
      const escapedName = `"${medicine.name.replace(/"/g, '""')}"`;
      const escapedCategory = `"${medicine.category.replace(/"/g, '""')}"`;
      const escapedManufacturer = medicine.manufacturer
        ? `"${medicine.manufacturer.replace(/"/g, '""')}"`
        : '""';
      const escapedDescription = medicine.description
        ? `"${medicine.description.replace(/"/g, '""')}"`
        : '""';

      csvContent += `${medicine.id},${escapedName},${escapedCategory},${medicine.stock},${medicine.price},${medicine.expiryDate},${escapedManufacturer},${escapedDescription}\n`;
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${filteredMedicines.length} items exported to CSV file.`,
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

  const importFromExcel = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split("\n");

        // Skip header row and process data
        if (lines.length > 1) {
          const header = lines[0].split(",");
          const nameIndex = header.findIndex((h) =>
            h.toLowerCase().includes("name"),
          );
          const categoryIndex = header.findIndex((h) =>
            h.toLowerCase().includes("category"),
          );
          const stockIndex = header.findIndex((h) =>
            h.toLowerCase().includes("stock"),
          );
          const priceIndex = header.findIndex((h) =>
            h.toLowerCase().includes("price"),
          );
          const expiryIndex = header.findIndex((h) =>
            h.toLowerCase().includes("expiry"),
          );

          const newMedicines: Medicine[] = [];

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = lines[i].split(",");
            const id = `med${String(Date.now() + i).slice(-6)}`;

            newMedicines.push({
              id,
              name: values[nameIndex] || `Medicine ${i}`,
              category: values[categoryIndex] || "Other",
              stock: parseInt(values[stockIndex]) || 0,
              price: parseFloat(values[priceIndex]) || 0,
              expiryDate:
                values[expiryIndex] || new Date().toISOString().split("T")[0],
            });
          }

          if (newMedicines.length > 0) {
            setMedicines((prev) => [...prev, ...newMedicines]);
            toast({
              title: "Import Successful",
              description: `${newMedicines.length} medicines have been imported.`,
            });
          }
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description:
            "There was an error processing your file. Please check the format and try again.",
        });
      }
    };

    reader.readAsText(file);
    setShowImportDialog(false);
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

      <EditMedicineDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        medicine={selectedMedicine}
        categories={categories}
        onSave={handleSaveMedicine}
      />

      <DeleteMedicineDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        medicine={selectedMedicine}
        onDelete={confirmDeleteMedicine}
      />
    </div>
  );
};

export default Inventory;
