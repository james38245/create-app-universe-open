
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Globe, Users, Building, Heart } from 'lucide-react';

const DashboardHeader = () => {
  const adminEmail = localStorage.getItem('admin_email');

  return (
    <div className="space-y-6">
      {/* App Branding & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Vendoor
                </h1>
                <p className="text-purple-200 text-lg">Event Management Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="h-4 w-4 mr-2" />
              Master Administrator
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                <p className="text-purple-200 text-sm">Live data synchronization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Global Reach</h3>
                <p className="text-purple-200 text-sm">Worldwide event management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">User-Centric</h3>
                <p className="text-purple-200 text-sm">Exceptional experiences</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to the Control Center</h2>
              <p className="text-purple-200 text-lg">
                Comprehensive platform management and oversight dashboard
              </p>
              <p className="text-purple-300 text-sm mt-2">
                Logged in as: <span className="font-medium text-white">{adminEmail}</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-sm text-purple-200">Users</div>
              </div>
              <div className="text-center">
                <Building className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-sm text-purple-200">Venues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <Card className="border-2 border-purple-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
              <p className="text-sm text-gray-600">Comprehensive user oversight and administration</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Venue Control</h3>
              <p className="text-sm text-gray-600">Manage venues and their availability</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Security & Access</h3>
              <p className="text-sm text-gray-600">Advanced security and permission management</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">System Health</h3>
              <p className="text-sm text-gray-600">Real-time monitoring and maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;
