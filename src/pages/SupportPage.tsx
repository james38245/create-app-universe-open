
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  HelpCircle,
  CheckCircle,
  Send,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SupportPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Support ticket created",
        description: "We've received your message and will respond within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Mon-Fri, 9 AM - 6 PM',
      action: 'Start Chat',
      color: 'bg-blue-500'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support experts',
      availability: '+254 700 000 000',
      action: 'Call Now',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us detailed questions or feedback',
      availability: 'support@vendoor.co.ke',
      action: 'Send Email',
      color: 'bg-purple-500'
    }
  ];

  const faqTopics = [
    { title: 'Booking Issues', count: 12, icon: '📅' },
    { title: 'Payment Problems', count: 8, icon: '💳' },
    { title: 'Account Questions', count: 6, icon: '👤' },
    { title: 'Technical Issues', count: 4, icon: '🔧' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Support Center
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're here to help! Choose the best way to get in touch with our support team.
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className={`${channel.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                    <p className="text-gray-600 mb-3">{channel.description}</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{channel.availability}</span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (channel.title === 'Phone Support') {
                          window.location.href = 'tel:+254700000000';
                        } else if (channel.title === 'Email Support') {
                          window.location.href = 'mailto:support@vendoor.co.ke';
                        }
                      }}
                    >
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Submit a Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Issues</SelectItem>
                          <SelectItem value="payment">Payment Problems</SelectItem>
                          <SelectItem value="account">Account Questions</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Help & FAQ */}
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
                      <span className="text-sm">Live Chat</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Instant
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Email Support</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Within 4 hours
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Support Tickets</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Within 24 hours
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Help Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {faqTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{topic.icon}</span>
                          <span className="font-medium">{topic.title}</span>
                        </div>
                        <Badge variant="outline">{topic.count} articles</Badge>
                      </div>
                    ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
