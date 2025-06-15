
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSettings } from '@/hooks/useUserSettings';
import SettingsHeader from '@/components/settings/SettingsHeader';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import DisplaySettings from '@/components/settings/DisplaySettings';

const UserSettings = () => {
  const {
    settings,
    handleSettingChange,
    handleSaveSettings,
    handleExportSettings,
    handleResetSettings,
    handleImportSettings
  } = useUserSettings();

  const handleImport = () => {
    document.getElementById('import-settings')?.click();
  };

  return (
    <div className="space-y-6">
      <SettingsHeader
        onImport={handleImport}
        onExport={handleExportSettings}
        onReset={handleResetSettings}
        onSave={handleSaveSettings}
        onImportChange={handleImportSettings}
      />

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <AppearanceSettings
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferences
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </TabsContent>

        <TabsContent value="display">
          <DisplaySettings
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
