
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import VenueManagement from '@/components/admin/VenueManagement';
import ProviderManagement from '@/components/admin/ProviderManagement';
import BookingManagement from '@/components/admin/BookingManagement';
import DocumentManagement from '@/components/admin/DocumentManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import { 
  BarChart3, 
  Users, 
  Building, 
  UserCheck, 
  Calendar, 
  FileText,
  Settings 
} from 'lucide-react';

const AdminDashboard = () => {
  // Check for valid admin session
  const sessionToken = localStorage.getItem('admin_session_token');
  const sessionExpiry = localStorage.getItem('admin_session_expiry');
  const lastActivity = localStorage.getItem('admin_last_activity');
  
  const isValidAdminSession = () => {
    if (!sessionToken || !sessionExpiry || !lastActivity) {
      return false;
    }
    
    const now = new Date().getTime();
    const expiry = parseInt(sessionExpiry);
    const lastActivityTime = parseInt(lastActivity);
    
    // Check if session is still valid (not expired and activity within last 2 hours)
    return now < expiry && (now - lastActivityTime) < (2 * 60 * 60 * 1000);
  };

  if (!isValidAdminSession()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page. Please log in through the admin portal.
            </p>
            <button 
              onClick={() => window.location.href = '/admin'} 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Go to Admin Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">System Administrator Dashboard</h1>
            <p className="text-muted-foreground">
              Complete system management and oversight panel
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="venues" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Venues</span>
              </TabsTrigger>
              <TabsTrigger value="providers" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Providers</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
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

            <TabsContent value="documents">
              <DocumentManagement />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
