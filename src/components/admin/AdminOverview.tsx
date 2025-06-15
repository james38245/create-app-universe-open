
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  Activity,
  AlertCircle,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SystemStatsOverview from './system/SystemStatsOverview';
import ListingVerificationPanel from './ListingVerificationPanel';

// Mock data for service provider distribution and system health
const mockData = {
  serviceProviderDistribution: [
    { name: 'Photography', value: 45, color: '#8884d8', verified: 38, pending: 7 },
    { name: 'Catering', value: 32, color: '#82ca9d', verified: 28, pending: 4 },
    { name: 'Music/DJ', value: 28, color: '#ffc658', verified: 25, pending: 3 },
    { name: 'Decoration', value: 24, color: '#ff7300', verified: 20, pending: 4 },
    { name: 'Security', value: 15, color: '#00ff00', verified: 12, pending: 3 },
    { name: 'Transportation', value: 12, color: '#ff0080', verified: 10, pending: 2 }
  ],
  providerStatusData: [
    { status: 'Verified', count: 133, color: '#10b981' },
    { status: 'Pending', count: 23, color: '#f59e0b' },
    { status: 'Rejected', count: 8, color: '#ef4444' }
  ],
  systemHealth: [
    { component: 'Database', status: 'healthy', uptime: '99.9%' },
    { component: 'Authentication', status: 'healthy', uptime: '100%' },
    { component: 'File Storage', status: 'warning', uptime: '98.5%' },
    { component: 'Notifications', status: 'healthy', uptime: '99.7%' }
  ],
  recentActivity: [
    { time: '2 minutes ago', action: 'New venue registration', user: 'Grand Ballroom' },
    { time: '15 minutes ago', action: 'Booking confirmed', user: 'John Doe' },
    { time: '1 hour ago', action: 'User profile updated', user: 'Jane Smith' },
    { time: '2 hours ago', action: 'Payment processed', user: 'Mike Johnson' },
    { time: '3 hours ago', action: 'Venue approved', user: 'City Convention Center' }
  ]
};

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      {/* System Stats Overview */}
      <SystemStatsOverview />

      {/* Listing Verification Panel */}
      <ListingVerificationPanel />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Provider Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Service Provider Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.serviceProviderDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="verified" stackId="a" fill="#10b981" name="Verified" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Provider Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockData.providerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mockData.providerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {mockData.providerStatusData.map((status, index) => (
                <div key={index} className="p-2">
                  <div className="text-2xl font-bold" style={{ color: status.color }}>
                    {status.count}
                  </div>
                  <div className="text-sm text-muted-foreground">{status.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Provider Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Service Categories Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.serviceProviderDistribution.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{category.value} total</div>
                      <div className="text-xs text-muted-foreground">
                        {category.verified} verified, {category.pending} pending
                      </div>
                    </div>
                    <Badge variant={category.pending > 0 ? 'secondary' : 'default'}>
                      {Math.round((category.verified / category.value) * 100)}% verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.systemHealth.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {item.status === 'healthy' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-medium">{item.component}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'healthy' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                  <p className="text-xs text-purple-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
