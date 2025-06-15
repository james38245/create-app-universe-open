
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PublicDocumentsProps {
  userId: string;
  showTitle?: boolean;
}

const PublicDocuments: React.FC<PublicDocumentsProps> = ({ userId, showTitle = true }) => {
  const { data: documents } = useQuery({
    queryKey: ['public-documents', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_public_documents', {
        target_user_id: userId
      });
      
      if (error) throw error;
      return data;
    }
  });

  const downloadDocument = async (documentId: string, fileName: string) => {
    try {
      // Get the document path first
      const { data: docData } = await supabase
        .from('user_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (docData) {
        const { data } = await supabase.storage
          .from('documents')
          .createSignedUrl(docData.file_path, 3600);

        if (data?.signedUrl) {
          const link = document.createElement('a');
          link.href = data.signedUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Credentials
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{doc.file_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {doc.document_type.toUpperCase()}
                    </Badge>
                    {doc.verified_by_admin && (
                      <Badge className="text-xs bg-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {formatDistanceToNow(new Date(doc.upload_date))} ago
                  </p>
                  {doc.admin_notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Note:</strong> {doc.admin_notes}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadDocument(doc.id, doc.file_name)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicDocuments;
