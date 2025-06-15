
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone, Calendar, Gift } from 'lucide-react';

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookingAlerts: boolean;
  marketingEmails: boolean;
}

interface NotificationPreferencesProps {
  settings: Settings;
  onSettingChange: (key: string, value: any) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  settings,
  onSettingChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notification Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <Label className="text-base font-medium">Email Notifications</Label>
            </div>
            <p className="text-xs text-muted-foreground">Receive updates and notifications via email</p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <Label className="text-base font-medium">Push Notifications</Label>
            </div>
            <p className="text-xs text-muted-foreground">Browser push notifications for real-time updates</p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
          />
        </div>

        {/* Booking Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <Label className="text-base font-medium">Booking Alerts</Label>
            </div>
            <p className="text-xs text-muted-foreground">Confirmations, updates, and reminders for your bookings</p>
          </div>
          <Switch
            checked={settings.bookingAlerts}
            onCheckedChange={(checked) => onSettingChange('bookingAlerts', checked)}
          />
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <Label className="text-base font-medium">Marketing Emails</Label>
            </div>
            <p className="text-xs text-muted-foreground">Promotional content, offers, and feature updates</p>
          </div>
          <Switch
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => onSettingChange('marketingEmails', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
