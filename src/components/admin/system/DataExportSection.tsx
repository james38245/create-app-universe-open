
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Download, RefreshCw } from 'lucide-react';

type TableName = 'bookings' | 'profiles' | 'service_providers' | 'venues' | 'listing_requirements' | 'messages' | 'reviews' | 'user_documents' | 'transactions' | 'validation_logs' | 'verification_requests';

const DataExportSection = () => {
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
  );
};

export default DataExportSection;
