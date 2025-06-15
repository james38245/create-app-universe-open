
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Shield, UserPlus, UserMinus, Key, Settings, Edit, RefreshCw } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import MFADialog from './MFADialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    refetchInterval: 30000, // Backup polling every 30 seconds
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
        // Create new admin user profile
        const { error } = await supabase
          .from('profiles')
          .insert([{
            email: email,
            user_type: role,
            full_name: email.split('@')[0]
          }]);
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
      {/* Real-time Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRealTimeConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isRealTimeConnected ? 'Real-time Connected' : 'Real-time Disconnected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <span className="text-xs text-muted-foreground">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={triggerRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrator Privileges Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Master Administrator</span>
            </div>
            <p className="text-blue-700">
              Email: {masterAdminEmail} (Full System Access)
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Administrators</h3>
            <Dialog open={isGrantingAccess} onOpenChange={setIsGrantingAccess}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Grant Admin Access
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant Administrator Privileges</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin_email">User Email</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="Enter user email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_role">Admin Role</Label>
                    <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-800 text-sm">
                      ⚠️ This action requires MFA verification. Only grant access to trusted individuals.
                    </p>
                  </div>
                  <Button onClick={handleGrantAccess} className="w-full">
                    Proceed with MFA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading admin users...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Error loading admin users</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Granted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers?.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.full_name || 'N/A'}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.email === masterAdminEmail ? "default" : "secondary"}>
                        {admin.email === masterAdminEmail ? "Master Admin" : admin.user_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {admin.email !== masterAdminEmail && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingAdmin(admin)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Administrator</DialogTitle>
                                </DialogHeader>
                                {editingAdmin && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Full Name</Label>
                                      <Input
                                        value={editingAdmin.full_name || ''}
                                        onChange={(e) => setEditingAdmin({...editingAdmin, full_name: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label>User Type</Label>
                                      <Select
                                        value={editingAdmin.user_type}
                                        onValueChange={(value) => setEditingAdmin({...editingAdmin, user_type: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          <SelectItem value="super_admin">Super Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button onClick={handleUpdateAdmin} className="w-full">
                                      Update with MFA
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAccess(admin)}
                              className="text-red-600"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
