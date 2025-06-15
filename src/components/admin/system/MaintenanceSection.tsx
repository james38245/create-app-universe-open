
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, RefreshCw, HardDrive, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const MaintenanceSection = () => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDatabaseCleanup = async () => {
    setLoadingAction('database');
    try {
      // Clean up old validation logs (older than 30 days)
      const { error: validationError } = await supabase
        .from('validation_logs')
        .delete()
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (validationError) throw validationError;

      // Clean up expired verification requests
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .delete()
        .eq('status', 'pending')
        .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (verificationError) throw verificationError;

      toast.success('Database cleanup completed successfully');
    } catch (error: any) {
      toast.error('Database cleanup failed: ' + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCacheRefresh = async () => {
    setLoadingAction('cache');
    try {
      // Invalidate all cached queries
      await queryClient.invalidateQueries();
      
      // Clear localStorage cache items
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('cache_') || key.startsWith('query_')
      );
      cacheKeys.forEach(key => localStorage.removeItem(key));

      toast.success('Cache refreshed successfully');
    } catch (error: any) {
      toast.error('Cache refresh failed: ' + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleStorageCleanup = async () => {
    setLoadingAction('storage');
    try {
      // Get list of all files in storage
      const { data: files, error: listError } = await supabase.storage
        .from('documents')
        .list();

      if (listError) throw listError;

      // Get all document references from database
      const { data: dbFiles, error: dbError } = await supabase
        .from('user_documents')
        .select('file_path');

      if (dbError) throw dbError;

      const dbFilePaths = new Set(dbFiles.map(f => f.file_path));
      
      // Find orphaned files (files in storage but not in database)
      const orphanedFiles = files?.filter(file => !dbFilePaths.has(file.name)) || [];

      if (orphanedFiles.length > 0) {
        // Delete orphaned files
        const { error: deleteError } = await supabase.storage
          .from('documents')
          .remove(orphanedFiles.map(f => f.name));

        if (deleteError) throw deleteError;
        
        toast.success(`Storage cleanup completed. Removed ${orphanedFiles.length} orphaned files.`);
      } else {
        toast.success('Storage cleanup completed. No orphaned files found.');
      }
    } catch (error: any) {
      toast.error('Storage cleanup failed: ' + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Maintenance Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleDatabaseCleanup}
            disabled={loadingAction === 'database'}
          >
            {loadingAction === 'database' ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Database className="h-6 w-6" />
            )}
            <span>Database Cleanup</span>
            <span className="text-xs text-muted-foreground">Clean old logs & expired requests</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleCacheRefresh}
            disabled={loadingAction === 'cache'}
          >
            {loadingAction === 'cache' ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <RefreshCw className="h-6 w-6" />
            )}
            <span>Cache Refresh</span>
            <span className="text-xs text-muted-foreground">Clear all cached data</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleStorageCleanup}
            disabled={loadingAction === 'storage'}
          >
            {loadingAction === 'storage' ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <HardDrive className="h-6 w-6" />
            )}
            <span>Storage Cleanup</span>
            <span className="text-xs text-muted-foreground">Remove orphaned files</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSection;
