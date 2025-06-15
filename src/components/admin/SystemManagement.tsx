
import React from 'react';
import SystemStatsOverview from './system/SystemStatsOverview';
import SystemHealthSection from './system/SystemHealthSection';
import SystemConfigSection from './system/SystemConfigSection';
import MaintenanceSection from './system/MaintenanceSection';

const SystemManagement = () => {
  return (
    <div className="space-y-6">
      <SystemStatsOverview />
      <SystemHealthSection />
      <SystemConfigSection />
      <MaintenanceSection />
    </div>
  );
};

export default SystemManagement;
