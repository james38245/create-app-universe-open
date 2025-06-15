
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';

const DocumentsTab = () => {
  const { user } = useAuth();
  const {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    togglePublic,
    getDocumentUrl
  } = useDocuments();

  // Check if user is a service provider
  const { data: isServiceProvider, isLoading: checkingProvider } = useQuery({
    queryKey: ['is-service-provider', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user
  });

  if (loading || checkingProvider) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Only service providers can upload documents
  if (!isServiceProvider) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Service Provider Only</h3>
          <p className="text-muted-foreground">
            Document management is only available for registered service providers. 
            Please create a service provider listing to access this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload and manage your CV, resume, certificates, and portfolio documents. 
            CV and resume documents are visible to potential clients when public.
          </p>
        </CardHeader>
        <CardContent>
          <DocumentUpload onUpload={uploadDocument} uploading={uploading} />
        </CardContent>
      </Card>

      <DocumentList
        documents={documents}
        onDelete={deleteDocument}
        onTogglePublic={togglePublic}
        onDownload={getDocumentUrl}
      />
    </div>
  );
};

export default DocumentsTab;
