
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Settings {
  darkMode: boolean;
  theme: string;
  fontSize: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookingAlerts: boolean;
  marketingEmails: boolean;
  itemsPerPage: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  autoSave: boolean;
}

const defaultSettings: Settings = {
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

export const useUserSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        
        // Apply saved settings immediately
        if (parsed.darkMode) {
          document.documentElement.classList.add('dark');
        }
        
        if (parsed.fontSize) {
          const fontSize = 
            parsed.fontSize === 'small' ? '14px' : 
            parsed.fontSize === 'large' ? '18px' : 
            parsed.fontSize === 'xl' ? '20px' : '16px';
          document.documentElement.style.fontSize = fontSize;
        }
        
        console.log('Settings loaded:', parsed);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load saved settings');
    }
  }, []);

  // Auto-save when settings change (if enabled)
  useEffect(() => {
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('user_settings', JSON.stringify(settings));
          console.log('Settings auto-saved:', settings);
        } catch (error) {
          console.error('Auto-save failed:', error);
          toast.error('Auto-save failed');
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [settings]);

  const formatDate = (date: Date, format: string) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const formatTime = (date: Date, format: string) => {
    if (format === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    console.log(`Changing ${key} to:`, value);
    
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Apply appearance changes immediately with visual feedback
      if (key === 'darkMode') {
        if (value) {
          document.documentElement.classList.add('dark');
          toast.success('Dark mode enabled');
        } else {
          document.documentElement.classList.remove('dark');
          toast.success('Light mode enabled');
        }
      }
      
      if (key === 'fontSize') {
        const fontSize = 
          value === 'small' ? '14px' : 
          value === 'large' ? '18px' : 
          value === 'xl' ? '20px' : '16px';
        document.documentElement.style.fontSize = fontSize;
        toast.success(`Font size changed to ${value}`);
      }
      
      if (key === 'theme') {
        toast.success(`Theme changed to ${value}`);
      }
      
      // Notification setting changes
      if (key === 'emailNotifications') {
        toast.success(value ? 'Email notifications enabled' : 'Email notifications disabled');
      }
      
      if (key === 'pushNotifications') {
        toast.success(value ? 'Push notifications enabled' : 'Push notifications disabled');
        if (value && 'Notification' in window) {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              toast.success('Push notification permission granted');
            } else {
              toast.error('Push notification permission denied');
            }
          });
        }
      }
      
      if (key === 'bookingAlerts') {
        toast.success(value ? 'Booking alerts enabled' : 'Booking alerts disabled');
      }
      
      if (key === 'marketingEmails') {
        toast.success(value ? 'Marketing emails enabled' : 'Marketing emails disabled');
      }
      
      // Display setting changes
      if (key === 'itemsPerPage') {
        toast.success(`Items per page set to ${value}`);
      }
      
      if (key === 'dateFormat') {
        const today = new Date();
        const formatted = formatDate(today, value);
        toast.success(`Date format changed: ${formatted}`);
      }
      
      if (key === 'timeFormat') {
        const now = new Date();
        const formatted = formatTime(now, value);
        toast.success(`Time format changed: ${formatted}`);
      }
      
      if (key === 'currency') {
        toast.success(`Currency changed to ${value}`);
      }
      
      if (key === 'autoSave') {
        toast.success(value ? 'Auto-save enabled' : 'Auto-save disabled');
      }
      
      return newSettings;
    });
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('user_settings', JSON.stringify(settings));
      console.log('Settings manually saved:', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleExportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eventspace_settings_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Settings exported');
      toast.success('Settings exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export settings');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSettings(defaultSettings);
      localStorage.setItem('user_settings', JSON.stringify(defaultSettings));
      
      // Reset visual changes
      document.documentElement.classList.remove('dark');
      document.documentElement.style.fontSize = '16px';
      
      console.log('Settings reset to default');
      toast.success('Settings reset to default');
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          const mergedSettings = { ...settings, ...importedSettings };
          setSettings(mergedSettings);
          localStorage.setItem('user_settings', JSON.stringify(mergedSettings));
          
          // Apply imported visual settings
          if (importedSettings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          if (importedSettings.fontSize) {
            const fontSize = 
              importedSettings.fontSize === 'small' ? '14px' : 
              importedSettings.fontSize === 'large' ? '18px' : 
              importedSettings.fontSize === 'xl' ? '20px' : '16px';
            document.documentElement.style.fontSize = fontSize;
          }
          
          console.log('Settings imported:', importedSettings);
          toast.success('Settings imported successfully');
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  return {
    settings,
    handleSettingChange,
    handleSaveSettings,
    handleExportSettings,
    handleResetSettings,
    handleImportSettings
  };
};
