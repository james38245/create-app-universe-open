
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Settings, Database, Users, Activity, BarChart3, Download, Upload } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SystemManagement = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    maxFileSize: '10',
    sessionTimeout: '4',
    commissionRate: '10',
    transactionFeeRate: '3'
  });

  // System statistics
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalVenues },
        { count: totalProviders },
        { count: totalBookings },
        { count: pendingVerifications }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalVenues: totalVenues || 0,
        totalProviders: totalProviders || 0,
        totalBookings: totalBookings || 0,
        pendingVerifications: pendingVerifications || 0
      };
    }
  });

  const handleExportData = async (table: string) => {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;

      const csv = convertToCSV(data);
      downloadCSV(csv, `${table}_export_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: "Data exported",
        description: `${table} data has been exported successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data.",
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const systemActions = [
    { id: 'backup_database', name: 'Backup Database', icon: Database, danger: false },
    { id: 'clear_cache', name: 'Clear System Cache', icon: Activity, danger: false },
    { id: 'maintenance_mode', name: 'Toggle Maintenance Mode', icon: Settings, danger: true },
    { id: 'reset_sessions', name: 'Reset All User Sessions', icon: Users, danger: true }
  ];

  const exportTables = [
    { id: 'profiles', name: 'User Profiles' },
    { id: 'venues', name: 'Venues' },
    { id: 'service_providers', name: 'Service Providers' },
    { id: 'bookings', name: 'Bookings' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'user_documents', name: 'Documents' }
  ];

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{systemStats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Venues</p>
                <p className="text-2xl font-bold">{systemStats?.totalVenues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Providers</p>
                <p className="text-2xl font-bold">{systemStats?.totalProviders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{systemStats?.totalBookings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Database className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold">{systemStats?.pendingVerifications || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={systemSettings.maxFileSize}
                  onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={systemSettings.commissionRate}
                  onChange={(e) => setSystemSettings({...systemSettings, commissionRate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="transactionFeeRate">Transaction Fee Rate (%)</Label>
                <Input
                  id="transactionFeeRate"
                  type="number"
                  value={systemSettings.transactionFeeRate}
                  onChange={(e) => setSystemSettings({...systemSettings, transactionFeeRate: e.target.value})}
                />
              </div>
            </div>
          </div>
          <Button className="mt-4">Save Configuration</Button>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemActions.map((action) => (
              <Button
                key={action.id}
                variant={action.danger ? "destructive" : "outline"}
                className="flex items-center gap-2 h-12"
                onClick={() => {
                  toast({
                    title: "Action executed",
                    description: `${action.name} has been executed.`,
                  });
                }}
              >
                <action.icon className="h-4 w-4" />
                {action.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export & Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportTables.map((table) => (
              <Button
                key={table.id}
                variant="outline"
                onClick={() => handleExportData(table.id)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export {table.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
