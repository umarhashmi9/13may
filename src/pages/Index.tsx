
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  useEffect(() => {
    console.log("Index page - Authentication status:", isAuthenticated);
    console.log("Index page - Current user:", currentUser);
  }, [isAuthenticated, currentUser]);
  
  // Direct redirection based on authentication status with log
  if (isAuthenticated && currentUser) {
    console.log("Index: User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  } else {
    console.log("Index: User is not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
};

export default Index;
