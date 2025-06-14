
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Bell, 
  HelpCircle, 
  MessageSquare, 
  Info, 
  Moon, 
  Sun, 
  Eye,
  Save,
  Download,
  RefreshCw
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
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_settings.json';
    link.click();
    toast.success('Settings exported successfully');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
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
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Settings</h2>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
        <div className="flex space-x-2">
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
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
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
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

        {/* FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I book a venue?",
                    answer: "Browse venues, select your preferred one, choose dates and services, then proceed with booking confirmation and payment."
                  },
                  {
                    question: "Can I cancel my booking?",
                    answer: "Yes, cancellation policies vary by venue. Check the specific venue's cancellation terms during booking."
                  },
                  {
                    question: "How do I contact a service provider?",
                    answer: "Visit the provider's profile page and use the messaging system to communicate directly."
                  },
                  {
                    question: "What payment methods are accepted?",
                    answer: "We accept major credit cards, debit cards, and digital payment methods. Payment options are shown during checkout."
                  },
                  {
                    question: "How do I update my profile?",
                    answer: "Go to your Profile page from the navigation menu to update your personal information and preferences."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Help & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Support Email:</strong> support@eventspace.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Quick Links</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Guide</Badge>
                      <span className="text-sm">Getting Started Guide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Video</Badge>
                      <span className="text-sm">How to Book a Venue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Help</Badge>
                      <span className="text-sm">Payment & Billing Help</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Contact Support</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Issue Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="account">Account Access</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Describe your issue..." />
                  </div>
                  <Button>Send Message</Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">About EventSpace</h3>
                    <p className="text-sm text-muted-foreground">Version 2.1.4 • Built with ❤️</p>
                  </div>
                  <Badge variant="outline">
                    <Info className="h-3 w-3 mr-1" />
                    App Info
                  </Badge>
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
