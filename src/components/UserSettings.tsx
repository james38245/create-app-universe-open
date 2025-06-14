
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Palette, 
  Bell, 
  Eye,
  Save,
  Download,
  RefreshCw,
  Moon, 
  Sun
} from 'lucide-react';
import { toast } from 'sonner';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: false,
    theme: 'default',
    fontSize: 'medium',
    language: 'english',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    
    // Display Preferences
    itemsPerPage: '20',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    
    // System
    autoSave: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        
        // Apply saved settings immediately
        if (parsed.darkMode) {
          document.documentElement.classList.add('dark');
        }
        
        if (parsed.fontSize) {
          const fontSize = 
            parsed.fontSize === 'small' ? '14px' : 
            parsed.fontSize === 'large' ? '18px' : 
            parsed.fontSize === 'xl' ? '20px' : '16px';
          document.documentElement.style.fontSize = fontSize;
        }
        
        console.log('Settings loaded:', parsed);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load saved settings');
    }
  }, []);

  // Auto-save when settings change (if enabled)
  useEffect(() => {
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('user_settings', JSON.stringify(settings));
          console.log('Settings auto-saved:', settings);
        } catch (error) {
          console.error('Auto-save failed:', error);
          toast.error('Auto-save failed');
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);
    
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Apply appearance changes immediately with visual feedback
      if (key === 'darkMode') {
        if (value) {
          document.documentElement.classList.add('dark');
          toast.success('Dark mode enabled');
        } else {
          document.documentElement.classList.remove('dark');
          toast.success('Light mode enabled');
        }
      }
      
      if (key === 'fontSize') {
        const fontSize = 
          value === 'small' ? '14px' : 
          value === 'large' ? '18px' : 
          value === 'xl' ? '20px' : '16px';
        document.documentElement.style.fontSize = fontSize;
        toast.success(`Font size changed to ${value}`);
      }
      
      if (key === 'theme') {
        toast.success(`Theme changed to ${value}`);
      }
      
      // Notification setting changes
      if (key === 'emailNotifications') {
        toast.success(value ? 'Email notifications enabled' : 'Email notifications disabled');
      }
      
      if (key === 'pushNotifications') {
        toast.success(value ? 'Push notifications enabled' : 'Push notifications disabled');
        // Request permission for push notifications if enabling
        if (value && 'Notification' in window) {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              toast.success('Push notification permission granted');
            } else {
              toast.error('Push notification permission denied');
            }
          });
        }
      }
      
      if (key === 'bookingAlerts') {
        toast.success(value ? 'Booking alerts enabled' : 'Booking alerts disabled');
      }
      
      if (key === 'marketingEmails') {
        toast.success(value ? 'Marketing emails enabled' : 'Marketing emails disabled');
      }
      
      // Display setting changes
      if (key === 'itemsPerPage') {
        toast.success(`Items per page set to ${value}`);
      }
      
      if (key === 'dateFormat') {
        const today = new Date();
        const formatted = formatDate(today, value);
        toast.success(`Date format changed: ${formatted}`);
      }
      
      if (key === 'timeFormat') {
        const now = new Date();
        const formatted = formatTime(now, value);
        toast.success(`Time format changed: ${formatted}`);
      }
      
      if (key === 'currency') {
        toast.success(`Currency changed to ${value}`);
      }
      
      if (key === 'autoSave') {
        toast.success(value ? 'Auto-save enabled' : 'Auto-save disabled');
      }
      
      return newSettings;
    });
  };

  const formatDate = (date: Date, format: string) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const formatTime = (date: Date, format: string) => {
    if (format === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      console.log('Settings manually saved:', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleExportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eventspace_settings_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Settings exported');
      toast.success('Settings exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export settings');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      const defaultSettings = {
        darkMode: false,
        theme: 'default',
        fontSize: 'medium',
        language: 'english',
        emailNotifications: true,
        pushNotifications: true,
        bookingAlerts: true,
        marketingEmails: false,
        itemsPerPage: '20',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currency: 'USD',
        autoSave: true
      };
      setSettings(defaultSettings);
      localStorage.setItem('user_settings', JSON.stringify(defaultSettings));
      
      // Reset visual changes
      document.documentElement.classList.remove('dark');
      document.documentElement.style.fontSize = '16px';
      
      console.log('Settings reset to default');
      toast.success('Settings reset to default');
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          const mergedSettings = { ...settings, ...importedSettings };
          setSettings(mergedSettings);
          localStorage.setItem('user_settings', JSON.stringify(mergedSettings));
          
          // Apply imported visual settings
          if (importedSettings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          if (importedSettings.fontSize) {
            const fontSize = 
              importedSettings.fontSize === 'small' ? '14px' : 
              importedSettings.fontSize === 'large' ? '18px' : 
              importedSettings.fontSize === 'xl' ? '20px' : '16px';
            document.documentElement.style.fontSize = fontSize;
          }
          
          console.log('Settings imported:', importedSettings);
          toast.success('Settings imported successfully');
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Settings</h2>
          <p className="text-muted-foreground">Customize your EventSpace experience</p>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
            id="import-settings"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('import-settings')?.click()}
          >
            Import
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance & Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <div className="flex items-center space-x-3">
                    <Sun className="h-4 w-4" />
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Purple</SelectItem>
                      <SelectItem value="blue">Ocean Blue</SelectItem>
                      <SelectItem value="green">Nature Green</SelectItem>
                      <SelectItem value="red">Crimson Red</SelectItem>
                      <SelectItem value="orange">Sunset Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    English is the only supported language
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Save Settings</Label>
                    <p className="text-xs text-muted-foreground">Automatically save changes as you make them</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Booking Alerts</Label>
                      <p className="text-xs text-muted-foreground">Booking confirmations & updates</p>
                    </div>
                    <Switch
                      checked={settings.bookingAlerts}
                      onCheckedChange={(checked) => handleSettingChange('bookingAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Promotional content & offers</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Display Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Items per Page</Label>
                  <Select value={settings.itemsPerPage} onValueChange={(value) => handleSettingChange('itemsPerPage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="20">20 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                      <SelectItem value="100">100 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange('timeFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
