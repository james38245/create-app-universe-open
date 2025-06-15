
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, RefreshCw, HardDrive } from 'lucide-react';

const MaintenanceSection = () => {
  return (
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
  );
};

export default MaintenanceSection;
