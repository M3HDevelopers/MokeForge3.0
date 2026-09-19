import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar?: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (otp: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock storage keys
const AUTH_STORAGE_KEY = 'mockforge_auth';
const USER_STORAGE_KEY = 'mockforge_user';

// Mock OTP (in real app, this comes from backend)
const MOCK_OTP = '123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (storedAuth && storedUser) {
      try {
        const authData = JSON.parse(storedAuth);
        const userData = JSON.parse(storedUser);
        
        if (authData.isAuthenticated) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to parse auth data:', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated }));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [isAuthenticated, user]);

  const clearError = () => setError(null);

  // Mock API delay
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Mock: Check if user exists (in real app, this calls backend)
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === email) {
          setUser(userData);
          setIsAuthenticated(true);
          return;
        }
      }
      
      // Mock: Create a default user for demo
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        emailVerified: true, // For demo, assume verified
        createdAt: Date.now(),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      
      // Mock validation
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Mock: Create user (in real app, this calls backend)
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        emailVerified: false, // Needs verification
        createdAt: Date.now(),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // In real app, backend sends OTP email
      console.log('Mock OTP sent:', MOCK_OTP);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      
      if (!otp) {
        throw new Error('OTP is required');
      }
      
      if (otp !== MOCK_OTP) {
        throw new Error('Invalid OTP. Please try again.');
      }
      
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      // Mock: Resend OTP (in real app, this calls backend)
      console.log('Mock OTP resent:', MOCK_OTP);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Mock: Send reset OTP (in real app, this calls backend)
      console.log('Mock password reset OTP sent:', MOCK_OTP);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (otp: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockDelay();
      
      if (!otp || !newPassword) {
        throw new Error('OTP and new password are required');
      }
      
      if (otp !== MOCK_OTP) {
        throw new Error('Invalid OTP');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Mock: Reset password (in real app, this calls backend)
      console.log('Mock password reset successful');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        verifyEmail,
        resendOTP,
        forgotPassword,
        resetPassword,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
