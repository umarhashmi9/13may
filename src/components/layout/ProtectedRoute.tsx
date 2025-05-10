
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'cashier' | 'pharmacist';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    console.log("ProtectedRoute - Authentication status:", isAuthenticated);
    console.log("ProtectedRoute - Current user:", currentUser);
  }, [isAuthenticated, currentUser]);

  // Ensure we have a valid authenticated state before proceeding
  if (!isAuthenticated || !currentUser) {
    console.log("ProtectedRoute: User not authenticated or no current user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && currentUser?.role !== requiredRole && currentUser?.role !== 'admin') {
    console.log("ProtectedRoute: User lacks required role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ProtectedRoute: User authenticated with correct role, rendering protected content");
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
