
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SystemConfig {
  platformCommission: number;
  transactionFee: number;
  defaultCurrency: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
}

const defaultConfig: SystemConfig = {
  platformCommission: 10,
  transactionFee: 3,
  defaultCurrency: 'KSH',
  sessionTimeout: 8,
  maxLoginAttempts: 3,
  passwordMinLength: 8
};

const SystemConfigSection = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('system_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
  }, []);

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in a real app, this would be saved to the database)
      localStorage.setItem('system_config', JSON.stringify(config));
      
      // Apply global settings
      document.documentElement.style.setProperty('--platform-commission', `${config.platformCommission}%`);
      document.documentElement.style.setProperty('--transaction-fee', `${config.transactionFee}%`);
      
      setHasChanges(false);
      toast.success('System configuration saved successfully');
    } catch (error: any) {
      toast.error('Failed to save configuration: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
    toast.success('Configuration reset to defaults');
  };

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
              <Input 
                type="number" 
                value={config.platformCommission}
                onChange={(e) => updateConfig('platformCommission', Number(e.target.value))}
                min="0"
                max="50"
              />
              <p className="text-xs text-muted-foreground">
                Commission charged on each booking (0-50%)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Transaction Fee (%)</Label>
              <Input 
                type="number" 
                value={config.transactionFee}
                onChange={(e) => updateConfig('transactionFee', Number(e.target.value))}
                min="0"
                max="10"
              />
              <p className="text-xs text-muted-foreground">
                Processing fee for payments (0-10%)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select 
                value={config.defaultCurrency}
                onValueChange={(value) => updateConfig('defaultCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KSH">KSH - Kenyan Shilling</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Security Settings</h4>
            <div className="space-y-2">
              <Label>Session Timeout (hours)</Label>
              <Input 
                type="number" 
                value={config.sessionTimeout}
                onChange={(e) => updateConfig('sessionTimeout', Number(e.target.value))}
                min="1"
                max="24"
              />
              <p className="text-xs text-muted-foreground">
                Automatic logout after inactivity (1-24 hours)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input 
                type="number" 
                value={config.maxLoginAttempts}
                onChange={(e) => updateConfig('maxLoginAttempts', Number(e.target.value))}
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground">
                Account lockout after failed attempts (1-10)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Password Min Length</Label>
              <Input 
                type="number" 
                value={config.passwordMinLength}
                onChange={(e) => updateConfig('passwordMinLength', Number(e.target.value))}
                min="6"
                max="20"
              />
              <p className="text-xs text-muted-foreground">
                Minimum password length requirement (6-20 characters)
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              onClick={saveConfiguration}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button 
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
          {hasChanges && (
            <p className="text-sm text-orange-600 mt-2">
              You have unsaved changes that will affect the entire platform.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemConfigSection;
