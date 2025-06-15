
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Download, Trash2, Eye, EyeOff, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  verified_by_admin: boolean;
  admin_notes?: string;
  is_public: boolean;
}

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string, filePath: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
  onDownload: (filePath: string) => Promise<string | null>;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  onTogglePublic,
  onDownload
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const url = await onDownload(filePath);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No documents uploaded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <div>
                  <CardTitle className="text-base">{doc.file_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {doc.document_type.toUpperCase()}
                    </Badge>
                    {doc.verified_by_admin && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc.file_path, doc.file_name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(doc.id, doc.file_path)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>Uploaded {formatDistanceToNow(new Date(doc.upload_date))} ago</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`public-${doc.id}`}
                    checked={doc.is_public}
                    onCheckedChange={(checked) => onTogglePublic(doc.id, checked)}
                  />
                  <Label htmlFor={`public-${doc.id}`} className="text-sm">
                    {doc.is_public ? (
                      <>
                        <Eye className="h-4 w-4 inline mr-1" />
                        Public (visible on your profile)
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 inline mr-1" />
                        Private
                      </>
                    )}
                  </Label>
                </div>
              </div>

              {doc.admin_notes && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Admin Notes:</p>
                  <p className="text-sm text-muted-foreground">{doc.admin_notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
