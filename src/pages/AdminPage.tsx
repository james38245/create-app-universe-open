
import React, { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import { AdminDataProvider } from '@/contexts/AdminDataContext';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const checkAdminSession = () => {
      const sessionToken = localStorage.getItem('admin_session_token');
      const sessionExpiry = localStorage.getItem('admin_session_expiry');
      const lastActivity = localStorage.getItem('admin_last_activity');
      
      if (sessionToken && sessionExpiry && lastActivity) {
        const now = new Date().getTime();
        const expiry = parseInt(sessionExpiry);
        const lastActivityTime = parseInt(lastActivity);
        
        // Check if session is still valid (not expired and activity within last 2 hours)
        const isValidSession = now < expiry && (now - lastActivityTime) < (2 * 60 * 60 * 1000);
        
        if (isValidSession) {
          // Update last activity
          localStorage.setItem('admin_last_activity', now.toString());
          setIsAuthenticated(true);
        } else {
          // Clear expired session
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_session_expiry');
          localStorage.removeItem('admin_last_activity');
          localStorage.removeItem('admin_role');
          localStorage.removeItem('admin_email');
        }
      }
      setIsLoading(false);
    };

    checkAdminSession();

    // Set up activity monitoring
    const updateActivity = () => {
      if (isAuthenticated) {
        localStorage.setItem('admin_last_activity', new Date().getTime().toString());
      }
    };

    // Update activity on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_session_expiry');
    localStorage.removeItem('admin_last_activity');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const adminEmail = localStorage.getItem('admin_email');
  const adminRole = localStorage.getItem('admin_role');

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-background">
        <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Master Administrator Panel</h1>
            <p className="text-sm text-gray-600">
              Logged in as: {adminEmail} ({adminRole === 'master_admin' ? 'Master Admin' : 'Admin'})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Secure Logout
          </button>
        </div>
        <AdminDashboard />
      </div>
    </AdminDataProvider>
  );
};

export default AdminPage;
