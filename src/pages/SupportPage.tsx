
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Info } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Help & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Support Email:</strong> support@eventspace.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Quick Links</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Guide</Badge>
                      <span className="text-sm">Getting Started Guide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Video</Badge>
                      <span className="text-sm">How to Book a Venue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Help</Badge>
                      <span className="text-sm">Payment & Billing Help</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Contact Support</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Issue Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="account">Account Access</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Describe your issue..." />
                  </div>
                  <Button>Send Message</Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">About EventSpace</h3>
                    <p className="text-sm text-muted-foreground">Version 2.1.4 • Built with ❤️</p>
                  </div>
                  <Badge variant="outline">
                    <Info className="h-3 w-3 mr-1" />
                    App Info
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
