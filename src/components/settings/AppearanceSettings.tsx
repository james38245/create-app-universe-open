
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Moon, Sun } from 'lucide-react';

interface Settings {
  darkMode: boolean;
  theme: string;
  fontSize: string;
  language: string;
  autoSave: boolean;
}

interface AppearanceSettingsProps {
  settings: Settings;
  onSettingChange: (key: string, value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  return (
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
                onCheckedChange={(checked) => onSettingChange('darkMode', checked)}
              />
              <Moon className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">
              {settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Color Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => onSettingChange('theme', value)}>
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
            <Select value={settings.fontSize} onValueChange={(value) => onSettingChange('fontSize', value)}>
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
            <Select value={settings.language} onValueChange={(value) => onSettingChange('language', value)}>
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
              onCheckedChange={(checked) => onSettingChange('autoSave', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
