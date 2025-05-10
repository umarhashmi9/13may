
import { Button } from "@/components/ui/button";
import { Upload, Download, Plus } from 'lucide-react';

interface InventoryHeaderProps {
  isPharmacist: boolean;
  onImport: () => void;
  onExport: () => void;
  onAdd: () => void;
}

export const InventoryHeader = ({
  isPharmacist,
  onImport,
  onExport,
  onAdd
}: InventoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      {isPharmacist && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medicine
          </Button>
        </div>
      )}
    </div>
  );
};
