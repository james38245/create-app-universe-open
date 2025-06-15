
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocuments } from '@/hooks/useDocuments';
import { Loader2 } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';

const DocumentsTab = () => {
  const {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    togglePublic,
    getDocumentUrl
  } = useDocuments();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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
