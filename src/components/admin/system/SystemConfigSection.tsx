
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

const SystemConfigSection = () => {
  return (
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
  );
};

export default SystemConfigSection;
