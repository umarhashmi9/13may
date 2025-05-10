
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  ref, 
  set, 
  get, 
  onValue, 
  update, 
  remove 
} from 'firebase/database';
import { auth, database } from '../integrations/firebase/config';
import { users as initialUsers } from '../data/mockData';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'cashier' | 'pharmacist';
  status?: 'active' | 'inactive';
  joinDate?: string;
  avatar?: string | null;
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  allUsers: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  allUsers: [],
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize users in Firebase if none exist
  useEffect(() => {
    const checkAndInitializeUsers = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (!snapshot.exists()) {
          console.log("No users found, initializing with mock data");
          // If no users exist in Firebase, initialize with mock data
          initialUsers.forEach(user => {
            set(ref(database, `users/${user.id}`), user);
          });
        }
      } catch (error) {
        console.error("Error initializing users:", error);
      }
    };
    
    checkAndInitializeUsers();
  }, []);
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "User logged out");
      setFirebaseUser(user);
      
      if (user) {
        // If user is authenticated, fetch their profile from the database
        try {
          const userRef = ref(database, `users`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersArray = Object.values(usersData) as User[];
            setAllUsers(usersArray);
            
            // Find the current user's profile by email
            const userProfile = usersArray.find(u => u.email === user.email);
            
            if (userProfile) {
              console.log("User profile found:", userProfile);
              setCurrentUser(userProfile);
              setIsAuthenticated(true);
              localStorage.setItem('medpulse-user', JSON.stringify(userProfile));
            } else {
              console.log("No matching user profile found for:", user.email);
              
              // Create a default admin user if the email contains 'admin'
              if (user.email && user.email.includes('admin')) {
                const newAdminUser = {
                  id: user.uid,
                  name: "Admin User",
                  email: user.email,
                  role: 'admin' as const,
                  status: 'active' as const,
                  joinDate: new Date().toISOString(),
                };
                
                console.log("Creating default admin user:", newAdminUser);
                await set(ref(database, `users/${user.uid}`), newAdminUser);
                setCurrentUser(newAdminUser);
                setIsAuthenticated(true);
                localStorage.setItem('medpulse-user', JSON.stringify(newAdminUser));
              }
            }
          } else {
            console.log("No users data found in database");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('medpulse-user');
      }
      
      setLoading(false);
    });
    
    // Set up listener for all users for admin purposes
    const usersRef = ref(database, 'users');
    const usersListener = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.values(usersData) as User[];
        setAllUsers(usersArray);
      }
    });
    
    return () => {
      unsubscribe();
      usersListener();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, user:", userCredential.user.email);
      
      // We'll handle the user profile in the auth state change listener
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('medpulse-user');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addUser = async (user: User) => {
    try {
      // Add user to database
      await set(ref(database, `users/${user.id}`), user);
      
      // Update local state
      setAllUsers(prev => [...prev, user]);
    } catch (error) {
      console.error("Add user error:", error);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      // Update user in database
      await update(ref(database, `users/${updatedUser.id}`), updatedUser);
      
      // Update local state
      setAllUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      // If the current user was updated, update the session
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        localStorage.setItem('medpulse-user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete user from database
      await remove(ref(database, `users/${userId}`));
      
      // Update local state
      setAllUsers(prev => prev.filter(user => user.id !== userId));
      
      // If the current user was deleted, log out
      if (currentUser && currentUser.id === userId) {
        logout();
      }
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    allUsers,
    addUser,
    updateUser,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{loading ? <div>Loading...</div> : children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
