
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Shield, UserPlus, UserMinus, Key, Edit, RefreshCw } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import MFADialog from './MFADialog';
import AdminPrivilegesTable from './AdminPrivilegesTable';
import AdminPrivilegesHeader from './AdminPrivilegesHeader';

const AdminPrivileges = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [mfaAction, setMfaAction] = useState<{
    isOpen: boolean;
    action: string;
    description: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    action: '',
    description: '',
    onSuccess: () => {}
  });
  
  const queryClient = useQueryClient();
  const { isRealTimeConnected, lastUpdate, triggerRefresh } = useAdminData();

  // Fetch admin users with real-time updates
  const { data: adminUsers, isLoading, error } = useQuery({
    queryKey: ['admin-users-privileges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('user_type', ['admin', 'super_admin', 'master_admin'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Grant admin privileges with MFA
  const grantAdminMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      // First check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Error checking user existence');
      }

      if (existingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({ user_type: role })
          .eq('email', email);
        if (error) throw error;
      } else {
        // Create new admin user profile - fix the TypeScript error by providing required id
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: crypto.randomUUID(),
            email: email,
            user_type: role,
            full_name: email.split('@')[0]
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-privileges'] });
      triggerRefresh();
      setNewAdminEmail('');
      setIsGrantingAccess(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to grant privileges",
        description: error.message || "Failed to grant admin privileges.",
        variant: "destructive"
      });
    }
  });

  // Update admin with MFA
  const updateAdminMutation = useMutation({
    mutationFn: async (admin: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(admin)
        .eq('id', admin.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-privileges'] });
      triggerRefresh();
      setEditingAdmin(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update admin",
        description: error.message || "Failed to update admin.",
        variant: "destructive"
      });
    }
  });

  // Revoke admin privileges with MFA
  const revokeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'client' })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-privileges'] });
      triggerRefresh();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to revoke privileges",
        description: error.message || "Failed to revoke admin privileges.",
        variant: "destructive"
      });
    }
  });

  const handleGrantAccess = () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive"
      });
      return;
    }

    setMfaAction({
      isOpen: true,
      action: 'Grant Admin Access',
      description: `Grant ${newAdminRole} privileges to ${newAdminEmail}`,
      onSuccess: () => {
        grantAdminMutation.mutate({
          email: newAdminEmail.trim(),
          role: newAdminRole
        });
      }
    });
  };

  const handleUpdateAdmin = () => {
    setMfaAction({
      isOpen: true,
      action: 'Update Admin Details',
      description: `Update admin details for ${editingAdmin?.email}`,
      onSuccess: () => {
        updateAdminMutation.mutate(editingAdmin);
      }
    });
  };

  const handleRevokeAccess = (admin: any) => {
    setMfaAction({
      isOpen: true,
      action: 'Revoke Admin Access',
      description: `Revoke admin privileges for ${admin.email}`,
      onSuccess: () => {
        revokeAdminMutation.mutate(admin.id);
      }
    });
  };

  const masterAdminEmail = 'wachira18james@gmail.com';

  return (
    <div className="space-y-6">
      <AdminPrivilegesHeader 
        isRealTimeConnected={isRealTimeConnected}
        lastUpdate={lastUpdate}
        triggerRefresh={triggerRefresh}
        masterAdminEmail={masterAdminEmail}
        isGrantingAccess={isGrantingAccess}
        setIsGrantingAccess={setIsGrantingAccess}
        newAdminEmail={newAdminEmail}
        setNewAdminEmail={setNewAdminEmail}
        newAdminRole={newAdminRole}
        setNewAdminRole={setNewAdminRole}
        handleGrantAccess={handleGrantAccess}
      />

      <AdminPrivilegesTable
        adminUsers={adminUsers}
        isLoading={isLoading}
        error={error}
        masterAdminEmail={masterAdminEmail}
        setEditingAdmin={setEditingAdmin}
        editingAdmin={editingAdmin}
        handleUpdateAdmin={handleUpdateAdmin}
        handleRevokeAccess={handleRevokeAccess}
      />

      <MFADialog
        isOpen={mfaAction.isOpen}
        onClose={() => setMfaAction(prev => ({ ...prev, isOpen: false }))}
        onSuccess={mfaAction.onSuccess}
        action={mfaAction.action}
        description={mfaAction.description}
      />
    </div>
  );
};

export default AdminPrivileges;
