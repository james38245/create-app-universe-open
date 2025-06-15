
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Document {
  id: string;
  user_id: string;
  document_type: 'cv' | 'resume' | 'certificate' | 'portfolio';
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  upload_date: string;
  verified_by_admin: boolean;
  admin_verified_at?: string;
  admin_verified_by?: string;
  admin_notes?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error loading documents",
        description: "Failed to load your documents.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, documentType: 'cv' | 'resume' | 'certificate' | 'portfolio') => {
    if (!user) return false;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document metadata
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          is_public: documentType === 'cv' || documentType === 'resume' // CV/Resume public by default
        });

      if (dbError) throw dbError;

      await fetchDocuments();
      
      toast({
        title: "Document uploaded",
        description: `${documentType.toUpperCase()} uploaded successfully.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      await fetchDocuments();
      
      toast({
        title: "Document deleted",
        description: "Document deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive"
      });
    }
  };

  const togglePublic = async (documentId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .update({ is_public: isPublic })
        .eq('id', documentId);

      if (error) throw error;

      await fetchDocuments();
      
      toast({
        title: "Visibility updated",
        description: `Document is now ${isPublic ? 'public' : 'private'}.`,
      });
    } catch (error: any) {
      console.error('Error updating document visibility:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update document visibility.",
        variant: "destructive"
      });
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    togglePublic,
    getDocumentUrl,
    refreshDocuments: fetchDocuments
  };
};
