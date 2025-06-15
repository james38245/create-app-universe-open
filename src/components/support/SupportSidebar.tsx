
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, MapPin } from 'lucide-react';

const SupportSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Response Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Response Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Phone Support</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Instant
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Email Support</span>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Within 4 hours
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Office Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Our Office
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Vendoor Support Center</p>
            <p className="text-gray-600">Westlands, Nairobi</p>
            <p className="text-gray-600">Kenya</p>
            <div className="pt-2 border-t">
              <p className="text-gray-600">Business Hours:</p>
              <p className="font-medium">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="font-medium">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSidebar;
