
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Save } from 'lucide-react';

interface SettingsHeaderProps {
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
  onSave: () => void;
  onImportChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onImport,
  onExport,
  onReset,
  onSave,
  onImportChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">My Settings</h2>
        <p className="text-muted-foreground">Customize your EventSpace experience</p>
      </div>
      <div className="flex space-x-2">
        <input
          type="file"
          accept=".json"
          onChange={onImportChange}
          className="hidden"
          id="import-settings"
        />
        <Button 
          variant="outline" 
          onClick={onImport}
        >
          Import
        </Button>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;
