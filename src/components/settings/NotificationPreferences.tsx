
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <Label className="text-base font-medium">Email Notifications</Label>
          </div>
          <RadioGroup
            value={settings.emailNotifications ? "enabled" : "disabled"}
            onValueChange={(value) => onSettingChange('emailNotifications', value === "enabled")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="email-enabled" />
              <Label htmlFor="email-enabled" className="cursor-pointer">Enabled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="email-disabled" />
              <Label htmlFor="email-disabled" className="cursor-pointer">Disabled</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Receive updates and notifications via email</p>
        </div>

        {/* Push Notifications */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <Label className="text-base font-medium">Push Notifications</Label>
          </div>
          <RadioGroup
            value={settings.pushNotifications ? "enabled" : "disabled"}
            onValueChange={(value) => onSettingChange('pushNotifications', value === "enabled")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="push-enabled" />
              <Label htmlFor="push-enabled" className="cursor-pointer">Enabled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="push-disabled" />
              <Label htmlFor="push-disabled" className="cursor-pointer">Disabled</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Browser push notifications for real-time updates</p>
        </div>

        {/* Booking Alerts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <Label className="text-base font-medium">Booking Alerts</Label>
          </div>
          <RadioGroup
            value={settings.bookingAlerts ? "enabled" : "disabled"}
            onValueChange={(value) => onSettingChange('bookingAlerts', value === "enabled")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="booking-enabled" />
              <Label htmlFor="booking-enabled" className="cursor-pointer">Enabled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="booking-disabled" />
              <Label htmlFor="booking-disabled" className="cursor-pointer">Disabled</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Confirmations, updates, and reminders for your bookings</p>
        </div>

        {/* Marketing Emails */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4" />
            <Label className="text-base font-medium">Marketing Emails</Label>
          </div>
          <RadioGroup
            value={settings.marketingEmails ? "enabled" : "disabled"}
            onValueChange={(value) => onSettingChange('marketingEmails', value === "enabled")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="marketing-enabled" />
              <Label htmlFor="marketing-enabled" className="cursor-pointer">Enabled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="marketing-disabled" />
              <Label htmlFor="marketing-disabled" className="cursor-pointer">Disabled</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Promotional content, offers, and feature updates</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
