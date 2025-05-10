
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add effect to redirect if already authenticated
  useEffect(() => {
    console.log("LoginPage - Authentication status:", isAuthenticated);
    console.log("LoginPage - Current user:", currentUser);
    
    if (isAuthenticated && currentUser) {
      console.log("User is already authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      // Firebase login
      const success = await login(email, password);
      
      if (success) {
        console.log("Login successful, redirecting to dashboard");
        toast({
          title: "Login successful",
          description: "Welcome to MedPulse POS",
        });
        
        // Wait very briefly for auth state to update in Firebase
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pharmacy-100 to-pharmacy-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-full shadow-md">
            <img 
              src="/lovable-uploads/cab1b2cd-6ab5-4a6b-9a8d-b211ac8ecd4b.png" 
              alt="WKGH Logo" 
              className="h-16 w-16"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pharmacy-800">WKGH</h1>
          <p className="text-gray-600">Pharmacy Point of Sale System</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <Input
                      id="email"
                      placeholder="admin@medpulse.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-pharmacy-600 hover:bg-pharmacy-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <div className="flex flex-col gap-1 mt-1">
            <div>admin@medpulse.com (Admin)</div>
            <div>cashier@medpulse.com (Cashier)</div>
            <div>pharmacist@medpulse.com (Pharmacist)</div>
          </div>
          <p className="mt-1">Use password "password123" for demo accounts</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
