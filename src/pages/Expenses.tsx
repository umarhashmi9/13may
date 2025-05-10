
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Search, Plus, Edit, Trash, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
}

const mockExpenses = [
  { 
    id: 'exp-001', 
    date: '2023-06-15', 
    category: 'Utilities',
    description: 'Electricity bill',
    amount: 245.60,
    paymentMethod: 'Bank Transfer'
  },
  { 
    id: 'exp-002', 
    date: '2023-06-12', 
    category: 'Rent',
    description: 'Monthly shop rent',
    amount: 1200.00,
    paymentMethod: 'Bank Transfer'
  },
  { 
    id: 'exp-003', 
    date: '2023-06-10', 
    category: 'Supplies',
    description: 'Office supplies',
    amount: 85.25,
    paymentMethod: 'Cash'
  },
  { 
    id: 'exp-004', 
    date: '2023-06-08', 
    category: 'Maintenance',
    description: 'AC repair',
    amount: 150.00,
    paymentMethod: 'Cash'
  },
  { 
    id: 'exp-005', 
    date: '2023-06-05', 
    category: 'Utilities',
    description: 'Water bill',
    amount: 52.75,
    paymentMethod: 'Bank Transfer'
  }
];

const expenseCategories = [
  'Utilities',
  'Rent',
  'Supplies',
  'Maintenance',
  'Salaries',
  'Marketing',
  'Insurance',
  'Transportation',
  'Other'
];

const chartData = [
  { month: 'Jan', amount: 1850.35 },
  { month: 'Feb', amount: 1720.80 },
  { month: 'Mar', amount: 1950.25 },
  { month: 'Apr', amount: 1845.90 },
  { month: 'May', amount: 1785.50 },
  { month: 'Jun', amount: 1733.60 }
];

const Expenses = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    category: 'Utilities',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'cash'
  });
  
  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Function to reset form data
  const resetFormData = () => {
    setFormData({
      description: '',
      category: 'Utilities',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'cash'
    });
  };
  
  // Open add expense dialog
  const openAddDialog = () => {
    resetFormData();
    setShowAddDialog(true);
  };
  
  // Open edit expense dialog
  const openEditDialog = (expense: Expense) => {
    setCurrentExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      paymentMethod: expense.paymentMethod.toLowerCase().replace(' ', '_')
    });
    setShowEditDialog(true);
  };
  
  // Add expense
  const handleAddExpense = () => {
    const newExpense: Expense = {
      id: `exp-${Date.now().toString().slice(-3)}`,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                    formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1)
    };
    
    setExpenses([newExpense, ...expenses]);
    setShowAddDialog(false);
    resetFormData();
    
    toast({
      title: "Expense Added",
      description: "The expense has been successfully recorded.",
    });
  };
  
  // Edit expense
  const handleEditExpense = () => {
    if (!currentExpense) return;
    
    const updatedExpenses = expenses.map(expense => {
      if (expense.id === currentExpense.id) {
        return {
          ...expense,
          date: formData.date,
          category: formData.category,
          description: formData.description,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                        formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1)
        };
      }
      return expense;
    });
    
    setExpenses(updatedExpenses);
    setShowEditDialog(false);
    resetFormData();
    setCurrentExpense(null);
    
    toast({
      title: "Expense Updated",
      description: "The expense has been successfully updated.",
    });
  };
  
  // Delete expense
  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(expense => expense.id !== id));
      toast({
        title: "Expense Deleted",
        description: "The expense has been successfully deleted.",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Monthly Expenses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`PKR ${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Expenses (Filtered)</h3>
              <div className="text-2xl font-bold">PKR {totalExpenses.toFixed(2)}</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <div className="text-2xl font-bold">PKR 1,733.60</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year to Date</h3>
              <div className="text-2xl font-bold">PKR 10,886.40</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Expense Records</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search expenses..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell>PKR {expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredExpenses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Wallet className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No expenses found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense with details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Electricity bill" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select 
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Expense Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update expense details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                placeholder="Electricity bill" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select 
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditExpense}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
