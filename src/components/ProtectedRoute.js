// Protected Route - Guard routes that require authentication
import React from 'react';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be handled by App component
  }

  return children;
}

export default ProtectedRoute;
