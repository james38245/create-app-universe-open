
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, UserPlus, Key, RefreshCw } from 'lucide-react';

interface AdminPrivilegesHeaderProps {
  isRealTimeConnected: boolean;
  lastUpdate: Date | null;
  triggerRefresh: () => void;
  masterAdminEmail: string;
  isGrantingAccess: boolean;
  setIsGrantingAccess: (value: boolean) => void;
  newAdminEmail: string;
  setNewAdminEmail: (value: string) => void;
  newAdminRole: string;
  setNewAdminRole: (value: string) => void;
  handleGrantAccess: () => void;
}

const AdminPrivilegesHeader: React.FC<AdminPrivilegesHeaderProps> = ({
  isRealTimeConnected,
  lastUpdate,
  triggerRefresh,
  masterAdminEmail,
  isGrantingAccess,
  setIsGrantingAccess,
  newAdminEmail,
  setNewAdminEmail,
  newAdminRole,
  setNewAdminRole,
  handleGrantAccess
}) => {
  return (
    <>
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
        </CardContent>
      </Card>
    </>
  );
};

export default AdminPrivilegesHeader;
