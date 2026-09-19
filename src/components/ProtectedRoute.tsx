import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified
  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
