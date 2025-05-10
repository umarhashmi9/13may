import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from 'react-day-picker';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ 
    from: new Date(new Date().setDate(new Date().getDate() - 30)), 
    to: new Date() 
  });
  const [reportPeriod, setReportPeriod] = useState("month");

  const salesData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 },
    { name: 'Jun', revenue: 2390, profit: 3800 },
    { name: 'Jul', revenue: 3490, profit: 4300 },
  ];
  
  const inventoryData = [
    { name: 'Antibiotics', stock: 45, value: 12000 },
    { name: 'Painkillers', stock: 32, value: 8000 },
    { name: 'Vitamins', stock: 87, value: 6500 },
    { name: 'Antacids', stock: 23, value: 3200 },
    { name: 'Antihistamines', stock: 16, value: 4100 },
    { name: 'Cough Syrups', stock: 29, value: 5400 },
  ];
  
  const recentSalesData = [
    { id: 'INV001', date: '2023-05-01', customer: 'John Doe', amount: 125.99, status: 'Completed' },
    { id: 'INV002', date: '2023-05-02', customer: 'Jane Smith', amount: 89.75, status: 'Completed' },
    { id: 'INV003', date: '2023-05-03', customer: 'Robert Brown', amount: 254.50, status: 'Pending' },
    { id: 'INV004', date: '2023-05-04', customer: 'Emily Davis', amount: 76.25, status: 'Completed' },
    { id: 'INV005', date: '2023-05-05', customer: 'Michael Wilson', amount: 198.00, status: 'Completed' },
  ];
  
  const profitLossData = {
    income: {
      sales: 28950.75,
      other: 1250.00
    },
    expenses: {
      purchases: 15780.50,
      rent: 2500.00,
      utilities: 950.25,
      salaries: 5800.00,
      other: 1200.00
    }
  };
  
  const userLogData = [
    { user: 'Admin', login: '2023-05-01 08:00', logout: '2023-05-01 17:00', hours: 9 },
    { user: 'Cashier 1', login: '2023-05-01 08:30', logout: '2023-05-01 16:30', hours: 8 },
    { user: 'Pharmacist', login: '2023-05-01 09:00', logout: '2023-05-01 18:00', hours: 9 },
    { user: 'Cashier 2', login: '2023-05-01 12:00', logout: '2023-05-01 20:00', hours: 8 },
    { user: 'Admin', login: '2023-05-02 08:15', logout: '2023-05-02 17:15', hours: 9 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderDateRangePicker = () => (
    <div className="flex items-center space-x-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              if (range) {
                setDateRange({ 
                  from: range.from as Date, 
                  to: range.to || range.from as Date 
                });
              }
            }}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Select value={reportPeriod} onValueChange={setReportPeriod}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
          <SelectItem value="year">Yearly</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
  
  const renderSalesReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Revenue and profit for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => {
                  return typeof value === 'number' 
                    ? `$${value.toFixed(2)}` 
                    : value;
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderInventoryReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value</CardTitle>
          <CardDescription>Stock levels and value by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "value") {
                        return [`$${Number(value).toFixed(2)}`, "Value"];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="stock" fill="#8884d8" name="Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderProfitLoss = () => {
    const totalIncome = profitLossData.income.sales + profitLossData.income.other;
    const totalExpenses = profitLossData.expenses.purchases + 
                         profitLossData.expenses.rent + 
                         profitLossData.expenses.utilities + 
                         profitLossData.expenses.salaries + 
                         profitLossData.expenses.other;
    const netProfit = totalIncome - totalExpenses;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss Statement</CardTitle>
            <CardDescription>Financial summary for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium">Income</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Sales Revenue</div>
                  <div className="text-right">${profitLossData.income.sales.toFixed(2)}</div>
                  <div>Other Income</div>
                  <div className="text-right">${profitLossData.income.other.toFixed(2)}</div>
                  <div className="font-medium">Total Income</div>
                  <div className="text-right font-medium">${totalIncome.toFixed(2)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium">Expenses</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Purchases</div>
                  <div className="text-right">${profitLossData.expenses.purchases.toFixed(2)}</div>
                  <div>Rent</div>
                  <div className="text-right">${profitLossData.expenses.rent.toFixed(2)}</div>
                  <div>Utilities</div>
                  <div className="text-right">${profitLossData.expenses.utilities.toFixed(2)}</div>
                  <div>Salaries</div>
                  <div className="text-right">${profitLossData.expenses.salaries.toFixed(2)}</div>
                  <div>Other Expenses</div>
                  <div className="text-right">${profitLossData.expenses.other.toFixed(2)}</div>
                  <div className="font-medium">Total Expenses</div>
                  <div className="text-right font-medium">${totalExpenses.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-lg font-semibold">Net Profit</div>
                  <div className={`text-right text-lg font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderUserTimeLog = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Time Log</CardTitle>
          <CardDescription>Staff attendance and working hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Logout Time</TableHead>
                <TableHead className="text-right">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLogData.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.login}</TableCell>
                  <TableCell>{log.logout}</TableCell>
                  <TableCell className="text-right">{log.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your pharmacy performance with detailed reports
          </p>
        </div>
      </div>
      
      {renderDateRangePicker()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
          <TabsTrigger value="time">User Time Log</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="mt-0">
          {renderSalesReports()}
        </TabsContent>
        <TabsContent value="inventory" className="mt-0">
          {renderInventoryReports()}
        </TabsContent>
        <TabsContent value="profit" className="mt-0">
          {renderProfitLoss()}
        </TabsContent>
        <TabsContent value="time" className="mt-0">
          {renderUserTimeLog()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
