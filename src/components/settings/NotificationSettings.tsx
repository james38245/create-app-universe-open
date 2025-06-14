
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookingAlerts: boolean;
  marketingEmails: boolean;
}

interface NotificationSettingsProps {
  settings: Settings;
  onSettingChange: (key: string, value: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
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
                onCheckedChange={(checked) => onSettingChange('bookingAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Emails</Label>
                <p className="text-xs text-muted-foreground">Promotional content & offers</p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => onSettingChange('marketingEmails', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
