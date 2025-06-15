
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Database, 
  Download, 
  Upload, 
  Settings, 
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Activity
} from 'lucide-react';

type TableName = 'bookings' | 'profiles' | 'service_providers' | 'venues' | 'listing_requirements' | 'messages' | 'reviews' | 'user_documents' | 'transactions' | 'validation_logs' | 'verification_requests';

const SystemManagement = () => {
  const [selectedTable, setSelectedTable] = useState<TableName>('profiles');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const tables: { value: TableName; label: string }[] = [
    { value: 'profiles', label: 'User Profiles' },
    { value: 'venues', label: 'Venues' },
    { value: 'service_providers', label: 'Service Providers' },
    { value: 'bookings', label: 'Bookings' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'user_documents', label: 'User Documents' },
    { value: 'messages', label: 'Messages' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'validation_logs', label: 'Validation Logs' },
    { value: 'verification_requests', label: 'Verification Requests' },
    { value: 'listing_requirements', label: 'Listing Requirements' }
  ];

  // System stats query
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const stats = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: stats[0].count || 0,
        venues: stats[1].count || 0,
        providers: stats[2].count || 0,
        bookings: stats[3].count || 0,
        transactions: stats[4].count || 0
      };
    }
  });

  // Export data function
  const exportData = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*');

      if (error) throw error;

      if (exportFormat === 'csv') {
        const csv = convertToCSV(data);
        downloadFile(csv, `${selectedTable}_export.csv`, 'text/csv');
      } else {
        const json = JSON.stringify(data, null, 2);
        downloadFile(json, `${selectedTable}_export.json`, 'application/json');
      }

      toast({
        title: "Export successful",
        description: `${selectedTable} data exported successfully`
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{systemStats?.users}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{systemStats?.venues}</div>
            <div className="text-sm text-muted-foreground">Venues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{systemStats?.providers}</div>
            <div className="text-sm text-muted-foreground">Providers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{systemStats?.bookings}</div>
            <div className="text-sm text-muted-foreground">Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{systemStats?.transactions}</div>
            <div className="text-sm text-muted-foreground">Transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Select Table</Label>
              <Select value={selectedTable} onValueChange={(value: TableName) => setSelectedTable(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table.value} value={table.value}>
                      {table.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={exportData} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">Database</div>
                <div className="text-sm text-green-600">Online</div>
              </div>
              <Badge variant="default" className="bg-green-600">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">Authentication</div>
                <div className="text-sm text-blue-600">99.9% uptime</div>
              </div>
              <Badge variant="default" className="bg-blue-600">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <div className="font-medium">Storage</div>
                <div className="text-sm text-yellow-600">85% capacity</div>
              </div>
              <Badge variant="secondary">Warning</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">API</div>
                <div className="text-sm text-green-600">Responsive</div>
              </div>
              <Badge variant="default" className="bg-green-600">Healthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">General Settings</h4>
              <div className="space-y-2">
                <Label>Platform Commission (%)</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label>Transaction Fee (%)</Label>
                <Input type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select defaultValue="KSH">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KSH">KSH - Kenyan Shilling</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Security Settings</h4>
              <div className="space-y-2">
                <Label>Session Timeout (hours)</Label>
                <Input type="number" defaultValue="8" />
              </div>
              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Input type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <Label>Password Min Length</Label>
                <Input type="number" defaultValue="8" />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button className="mr-2">Save Configuration</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Maintenance Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>Database Cleanup</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <RefreshCw className="h-6 w-6" />
              <span>Cache Refresh</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <HardDrive className="h-6 w-6" />
              <span>Storage Cleanup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
