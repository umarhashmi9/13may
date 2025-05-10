
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onAdd: () => void;
}

export const AddMedicineDialog = ({
  open,
  onOpenChange,
  categories,
  onAdd
}: AddMedicineDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>
            Enter the details of the new medicine to add to inventory
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Medicine name" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input type="number" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input type="date" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Manufacturer</label>
              <Input placeholder="Manufacturer" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="Medicine description" />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAdd}>Add Medicine</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
