
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { FileText, Shield, CheckCircle, XCircle, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DocumentManagement = () => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  // Fetch all documents for admin review
  const { data: documents } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_documents')
        .select(`
          *,
          profiles!user_documents_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Verify document mutation
  const verifyDocumentMutation = useMutation({
    mutationFn: async ({ documentId, verified, notes }: { documentId: string; verified: boolean; notes: string }) => {
      const { error } = await supabase
        .from('user_documents')
        .update({
          verified_by_admin: verified,
          admin_verified_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', documentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
      toast({
        title: "Document updated",
        description: "Document verification status updated successfully.",
      });
      setSelectedDocument(null);
      setAdminNotes('');
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update document.",
        variant: "destructive"
      });
    }
  });

  const handleDocumentAction = (document: any, verified: boolean) => {
    verifyDocumentMutation.mutate({
      documentId: document.id,
      verified,
      notes: adminNotes
    });
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "Failed to download document.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Document Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{document.profiles?.full_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{document.profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{document.file_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {document.document_type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{formatFileSize(document.file_size)}</TableCell>
                <TableCell>
                  {document.verified_by_admin ? (
                    <Badge className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Pending Review
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(document.upload_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(document.file_path, document.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            setAdminNotes(document.admin_notes || '');
                          }}
                        >
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review Document</DialogTitle>
                        </DialogHeader>
                        {selectedDocument && (
                          <div className="space-y-4">
                            <div>
                              <p><strong>User:</strong> {selectedDocument.profiles?.full_name}</p>
                              <p><strong>File:</strong> {selectedDocument.file_name}</p>
                              <p><strong>Type:</strong> {selectedDocument.document_type.toUpperCase()}</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Admin Notes</label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add verification notes..."
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleDocumentAction(selectedDocument, false)}
                                className="flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleDocumentAction(selectedDocument, true)}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Verify
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DocumentManagement;
