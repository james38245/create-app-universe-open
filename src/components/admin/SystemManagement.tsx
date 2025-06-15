
import React from 'react';
import SystemStatsOverview from './system/SystemStatsOverview';
import DataExportSection from './system/DataExportSection';
import SystemHealthSection from './system/SystemHealthSection';
import SystemConfigSection from './system/SystemConfigSection';
import MaintenanceSection from './system/MaintenanceSection';

const SystemManagement = () => {
  return (
    <div className="space-y-6">
      <SystemStatsOverview />
      <DataExportSection />
      <SystemHealthSection />
      <SystemConfigSection />
      <MaintenanceSection />
    </div>
  );
};

export default SystemManagement;
