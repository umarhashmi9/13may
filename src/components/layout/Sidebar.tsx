
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  ChartBarIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Hospital,
  Receipt,
  Wallet,
  RotateCcw,
  Calendar,
  Clock
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: SidebarItemProps) => (
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
      active && "bg-gray-100 text-gray-900"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Check user role to determine which menu items to show
  const isAdmin = currentUser?.role === 'admin';
  const isCashier = currentUser?.role === 'cashier';
  const isPharmacist = currentUser?.role === 'pharmacist';
  
  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 h-16 border-b">
            <img 
              src="/lovable-uploads/cab1b2cd-6ab5-4a6b-9a8d-b211ac8ecd4b.png" 
              alt="WKGH Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-pharmacy-800">WKGH</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              href="/dashboard" 
              active={location.pathname === '/dashboard'} 
              onClick={closeSidebar} 
            />
            
            {/* Sales (visible to admin and cashier) */}
            {(isAdmin || isCashier) && (
              <SidebarItem 
                icon={ShoppingCart} 
                label="Sales" 
                href="/sales" 
                active={location.pathname.startsWith('/sales')} 
                onClick={closeSidebar} 
              />
            )}
            
            {/* Inventory (visible to all) */}
            <SidebarItem 
              icon={Package} 
              label="Inventory" 
              href="/inventory" 
              active={location.pathname.startsWith('/inventory')} 
              onClick={closeSidebar} 
            />
            
            {/* Customers (visible to admin and cashier) */}
            {(isAdmin || isCashier) && (
              <SidebarItem 
                icon={Users} 
                label="Customers" 
                href="/customers" 
                active={location.pathname.startsWith('/customers')} 
                onClick={closeSidebar} 
              />
            )}
            
            {/* Suppliers and Purchases (visible to admin and pharmacist) */}
            {(isAdmin || isPharmacist) && (
              <>
                <SidebarItem 
                  icon={Truck} 
                  label="Suppliers" 
                  href="/suppliers" 
                  active={location.pathname.startsWith('/suppliers')} 
                  onClick={closeSidebar} 
                />
                
                <SidebarItem 
                  icon={Receipt} 
                  label="Purchases" 
                  href="/purchases" 
                  active={location.pathname.startsWith('/purchases')} 
                  onClick={closeSidebar} 
                />
              </>
            )}
            
            {/* Returns (visible to admin, cashier and pharmacist) */}
            <SidebarItem 
              icon={RotateCcw} 
              label="Returns" 
              href="/returns" 
              active={location.pathname.startsWith('/returns')} 
              onClick={closeSidebar} 
            />

            {/* Expenses (visible to admin) */}
            {isAdmin && (
              <SidebarItem 
                icon={Wallet} 
                label="Expenses" 
                href="/expenses" 
                active={location.pathname.startsWith('/expenses')} 
                onClick={closeSidebar} 
              />
            )}
            
            {/* Staff (visible to admin) */}
            {isAdmin && (
              <SidebarItem 
                icon={Users} 
                label="Users" 
                href="/users" 
                active={location.pathname.startsWith('/users')} 
                onClick={closeSidebar} 
              />
            )}

            {/* Shifts (visible to admin) */}
            {isAdmin && (
              <SidebarItem 
                icon={Clock} 
                label="Shifts" 
                href="/shifts" 
                active={location.pathname.startsWith('/shifts')} 
                onClick={closeSidebar} 
              />
            )}
            
            {/* Reports (visible to admin) */}
            {isAdmin && (
              <SidebarItem 
                icon={ChartBarIcon} 
                label="Reports" 
                href="/reports" 
                active={location.pathname.startsWith('/reports')} 
                onClick={closeSidebar} 
              />
            )}
            
            {/* Settings (visible to admin) */}
            {isAdmin && (
              <SidebarItem 
                icon={Settings} 
                label="Settings" 
                href="/settings" 
                active={location.pathname.startsWith('/settings')} 
                onClick={closeSidebar} 
              />
            )}
          </nav>
          
          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4 gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{currentUser?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{currentUser?.role}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
