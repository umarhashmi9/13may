
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

export const ImportDialog = ({
  open,
  onOpenChange,
  onFileSelect,
  onImport
}: ImportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Inventory Data</DialogTitle>
          <DialogDescription>
            Import inventory data from a CSV or Excel file
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File</label>
            <Input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={onFileSelect}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Supported formats: CSV, XLSX, XLS
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="text-sm text-amber-800">
                <p className="font-medium">Import Guidelines:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>File must contain columns: Name, Category, Stock, Price, Expiry Date</li>
                  <li>First row should be column headers</li>
                  <li>Dates should be in YYYY-MM-DD format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onImport}>Import Data</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
