
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  PackageIcon, 
  UserIcon, 
  AlertTriangle, 
  TrendingUp
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { medicines, sales, salesData } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  // Calculate totals and stats
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = medicines.length;
  const lowStockProducts = medicines.filter(medicine => medicine.stock < 50).length;
  
  // Get medicines expiring in the next 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const expiringMedicines = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiryDate);
    return expiryDate <= thirtyDaysFromNow;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {currentUser?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                <p className="text-xs text-green-600">+2.5% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-pharmacy-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-pharmacy-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-gray-500">In inventory</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PackageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
                <p className="text-xs text-orange-600">Needs reordering</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-blue-600">Active customers</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Sales performance for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Sales ($)" 
                  stroke="#0891b2" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Sales performance for this year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="sales" 
                    name="Sales ($)" 
                    fill="#0891b2" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expiring Products Alert */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expiring Products</CardTitle>
            <CardDescription>Medicines expiring within 30 days</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">
              {expiringMedicines.length} Products
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expiringMedicines.length > 0 ? (
                  expiringMedicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{medicine.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{medicine.category}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{medicine.stock}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-sm text-center text-gray-500">
                      No products are expiring within 30 days
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
