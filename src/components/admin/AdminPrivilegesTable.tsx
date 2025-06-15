
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, UserMinus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AdminPrivilegesTableProps {
  adminUsers: any[] | undefined;
  isLoading: boolean;
  error: any;
  masterAdminEmail: string;
  setEditingAdmin: (admin: any) => void;
  editingAdmin: any;
  handleUpdateAdmin: () => void;
  handleRevokeAccess: (admin: any) => void;
}

const AdminPrivilegesTable: React.FC<AdminPrivilegesTableProps> = ({
  adminUsers,
  isLoading,
  error,
  masterAdminEmail,
  setEditingAdmin,
  editingAdmin,
  handleUpdateAdmin,
  handleRevokeAccess
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">Loading admin users...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">Error loading admin users</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  );
};

export default AdminPrivilegesTable;
