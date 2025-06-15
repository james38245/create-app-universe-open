
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
import { Shield, UserPlus, UserMinus, Key, Settings } from 'lucide-react';
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
  const queryClient = useQueryClient();

  // Fetch admin users
  const { data: adminUsers } = useQuery({
    queryKey: ['admin-users-privileges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'admin')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Grant admin privileges
  const grantAdminMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: role })
        .eq('email', email);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-privileges'] });
      toast({
        title: "Admin privileges granted",
        description: "User has been granted admin access successfully.",
      });
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

  // Revoke admin privileges
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
      toast({
        title: "Admin privileges revoked",
        description: "User admin privileges have been revoked successfully.",
      });
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

    grantAdminMutation.mutate({
      email: newAdminEmail.trim(),
      role: newAdminRole
    });
  };

  const masterAdminEmail = 'wachira18james@gmail.com';

  return (
    <div className="space-y-6">
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
                      ⚠️ This will grant administrative privileges to the specified user. 
                      Only grant access to trusted individuals.
                    </p>
                  </div>
                  <Button onClick={handleGrantAccess} className="w-full">
                    Grant Access
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

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
                    {admin.email !== masterAdminEmail && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Admin Privileges</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to revoke admin privileges for {admin.email}? 
                              This action will remove their access to the admin dashboard.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => revokeAdminMutation.mutate(admin.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Revoke Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrivileges;
