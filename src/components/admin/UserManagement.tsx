
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
import { Edit, Trash2, FileText, Plus, RefreshCw } from 'lucide-react';
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

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    user_type: 'client',
    phone: ''
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
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
  const { triggerRefresh } = useAdminData();

  // Fetch users with document counts and real-time updates
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_documents (
            id,
            document_type,
            verified_by_admin
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: crypto.randomUUID(),
          ...userData,
          created_at: new Date().toISOString()
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      triggerRefresh();
      setNewUser({ email: '', full_name: '', user_type: 'client', phone: '' });
      setIsCreatingUser(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create user.",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (user: any) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: user.full_name,
          user_type: user.user_type,
          phone: user.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      triggerRefresh();
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update user.",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // First delete related documents
      await supabase
        .from('user_documents')
        .delete()
        .eq('user_id', userId);
        
      // Then delete the user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      triggerRefresh();
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete user.",
        variant: "destructive"
      });
    }
  });

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.full_name) {
      toast({
        title: "Missing fields",
        description: "Email and full name are required.",
        variant: "destructive"
      });
      return;
    }

    setMfaAction({
      isOpen: true,
      action: 'Create New User',
      description: `Create user ${newUser.full_name} (${newUser.email})`,
      onSuccess: () => {
        createUserMutation.mutate(newUser);
      }
    });
  };

  const handleUpdateUser = () => {
    setMfaAction({
      isOpen: true,
      action: 'Update User',
      description: `Update ${editingUser?.full_name || editingUser?.email}`,
      onSuccess: () => {
        updateUserMutation.mutate(editingUser);
      }
    });
  };

  const handleDeleteUser = (user: any) => {
    setMfaAction({
      isOpen: true,
      action: 'Delete User',
      description: `Permanently delete ${user.full_name || user.email} and all associated data`,
      onSuccess: () => {
        deleteUserMutation.mutate(user.id);
      }
    });
  };

  const getDocumentStats = (documents: any[]) => {
    const total = documents?.length || 0;
    const verified = documents?.filter(d => d.verified_by_admin)?.length || 0;
    const cvResume = documents?.filter(d => ['cv', 'resume'].includes(d.document_type))?.length || 0;
    
    return { total, verified, cvResume };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Management</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new_email">Email *</Label>
                      <Input
                        id="new_email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_full_name">Full Name *</Label>
                      <Input
                        id="new_full_name"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_user_type">User Type</Label>
                      <Select
                        value={newUser.user_type}
                        onValueChange={(value) => setNewUser({...newUser, user_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="venue_owner">Venue Owner</SelectItem>
                          <SelectItem value="service_provider">Service Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new_phone">Phone</Label>
                      <Input
                        id="new_phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="+254700000000"
                      />
                    </div>
                    <Button onClick={handleCreateUser} className="w-full">
                      Create with MFA
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => {
                  const docStats = getDocumentStats(user.user_documents || []);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.user_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">
                            {docStats.total} total, {docStats.verified} verified
                          </span>
                          {docStats.cvResume > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              CV/Resume
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              {editingUser && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                      id="full_name"
                                      value={editingUser.full_name || ''}
                                      onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="user_type">User Type</Label>
                                    <Select
                                      value={editingUser.user_type}
                                      onValueChange={(value) => setEditingUser({...editingUser, user_type: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="venue_owner">Venue Owner</SelectItem>
                                        <SelectItem value="service_provider">Service Provider</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                      id="phone"
                                      value={editingUser.phone || ''}
                                      onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                                    />
                                  </div>
                                  <Button onClick={handleUpdateUser} className="w-full">
                                    Update with MFA
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

export default UserManagement;
