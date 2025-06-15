
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

const SystemHealthSection = () => {
  return (
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
  );
};

export default SystemHealthSection;
