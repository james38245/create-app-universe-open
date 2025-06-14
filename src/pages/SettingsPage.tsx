
import React from 'react';
import UserSettings from '@/components/UserSettings';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <UserSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
