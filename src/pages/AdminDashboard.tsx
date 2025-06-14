
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Activity, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import VenueManagement from '@/components/admin/VenueManagement';
import ProviderManagement from '@/components/admin/ProviderManagement';
import BookingManagement from '@/components/admin/BookingManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  // Enhanced session management
  useEffect(() => {
    const checkAuthentication = () => {
      const sessionToken = localStorage.getItem('admin_session_token');
      const sessionExpiry = localStorage.getItem('admin_session_expiry');
      const lastActivity = localStorage.getItem('admin_last_activity');
      
      if (sessionToken && sessionExpiry && lastActivity) {
        const now = new Date().getTime();
        const expiryTime = parseInt(sessionExpiry);
        const lastActivityTime = parseInt(lastActivity);
        
        // Check if session is still valid
        if (now < expiryTime && (now - lastActivityTime) < (30 * 60 * 1000)) { // 30 min inactivity timeout
          setIsAuthenticated(true);
          setSessionTimeLeft(Math.floor((expiryTime - now) / 1000));
          
          // Update last activity
          localStorage.setItem('admin_last_activity', now.toString());
        } else {
          // Session expired
          handleLogout(false);
        }
      }
    };

    checkAuthentication();
    
    // Check session every minute
    const sessionInterval = setInterval(checkAuthentication, 60000);
    
    // Update session timer every second
    const timerInterval = setInterval(() => {
      const sessionExpiry = localStorage.getItem('admin_session_expiry');
      if (sessionExpiry) {
        const timeLeft = Math.floor((parseInt(sessionExpiry) - new Date().getTime()) / 1000);
        setSessionTimeLeft(Math.max(0, timeLeft));
        
        // Warn when 5 minutes left
        if (timeLeft === 300) {
          toast.warning('Session expires in 5 minutes');
        }
      }
    }, 1000);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success('Secure access granted - Session established');
  };

  const handleLogout = (showMessage = true) => {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_session_expiry');
    localStorage.removeItem('admin_last_activity');
    setIsAuthenticated(false);
    setSessionTimeLeft(0);
    if (showMessage) {
      toast.success('Securely logged out');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Enhanced Header with Security Info */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl md:text-3xl font-bold">System Administration Portal</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Secure Session
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Developer Dashboard - Comprehensive System Management
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Session: {formatTime(sessionTimeLeft)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Last Activity: {new Date().toLocaleTimeString()}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="hidden md:flex">
                Developer Access
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => handleLogout()}
                className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Secure Logout</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                System Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger value="venues" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Venue Control
              </TabsTrigger>
              <TabsTrigger value="providers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Provider Control
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Booking Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AdminOverview />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="venues">
              <VenueManagement />
            </TabsContent>

            <TabsContent value="providers">
              <ProviderManagement />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
