
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  CheckCircle,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Settings
} from 'lucide-react';

const SupportPage = () => {
  const supportChannels = [
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
      availability: 'vendoor505@gmail.com',
      action: 'Send Email',
      color: 'bg-purple-500'
    }
  ];

  const helpArticles = [
    {
      title: 'Booking Issues',
      count: 12,
      icon: '📅',
      articles: [
        {
          title: 'How to book a venue or service',
          content: 'Step-by-step guide: 1) Browse venues or service providers, 2) Select your preferred option, 3) Choose date and time, 4) Fill in booking details, 5) Confirm payment method, 6) Complete booking. You\'ll receive a confirmation email immediately.'
        },
        {
          title: 'Modifying or canceling bookings',
          content: 'To modify a booking: Go to "My Bookings" in your profile, find the booking, and click "Modify". For cancellations: Click "Cancel Booking" - refund eligibility depends on the cancellation policy of the service provider.'
        },
        {
          title: 'Booking confirmation issues',
          content: 'If you don\'t receive a booking confirmation: 1) Check your spam folder, 2) Verify your email address in profile settings, 3) Contact the service provider directly, 4) Check "My Bookings" section in your profile for booking status.'
        }
      ]
    },
    {
      title: 'Payment Problems',
      count: 8,
      icon: '💳',
      articles: [
        {
          title: 'Payment methods accepted',
          content: 'We accept: M-Pesa, Visa, Mastercard, and bank transfers. All payments are processed securely through our payment partners. Your card details are never stored on our servers.'
        },
        {
          title: 'Payment failed or declined',
          content: 'Common solutions: 1) Check if your card has sufficient funds, 2) Verify card details are correct, 3) Contact your bank for international transactions, 4) Try a different payment method, 5) Clear browser cache and try again.'
        },
        {
          title: 'Refund process and timeline',
          content: 'Refunds are processed according to the service provider\'s policy. Typically: 1) Request refund through "My Bookings", 2) Service provider reviews within 24-48 hours, 3) Approved refunds take 3-7 business days to reflect in your account.'
        }
      ]
    },
    {
      title: 'Account Questions',
      count: 6,
      icon: '👤',
      articles: [
        {
          title: 'Creating and verifying your account',
          content: 'Sign up with email and password. Verify your email by clicking the link sent to your inbox. Complete your profile with accurate information. Service providers need additional verification for listing services.'
        },
        {
          title: 'Password reset and security',
          content: 'Forgot password? Click "Forgot Password" on login page. Enter your email to receive reset instructions. For security: use strong passwords, enable two-factor authentication if available, and never share login details.'
        },
        {
          title: 'Profile management and settings',
          content: 'Access profile settings from the user menu. Update personal information, change password, manage notification preferences, view booking history, and upload profile picture. Keep information current for better service.'
        }
      ]
    },
    {
      title: 'Technical Issues',
      count: 4,
      icon: '🔧',
      articles: [
        {
          title: 'Website loading problems',
          content: 'Try these solutions: 1) Refresh the page, 2) Clear browser cache and cookies, 3) Try a different browser or incognito mode, 4) Check your internet connection, 5) Disable browser extensions temporarily.'
        },
        {
          title: 'Mobile app functionality',
          content: 'The website is mobile-optimized for all devices. If you experience issues: ensure you have a stable internet connection, update your mobile browser, clear browser data, or try accessing from a desktop computer.'
        },
        {
          title: 'Search and filtering issues',
          content: 'To improve search results: 1) Use specific keywords, 2) Try different search terms, 3) Use filters (location, price, date), 4) Check spelling, 5) Browse categories if search doesn\'t work. Clear all filters to see all available options.'
        }
      ]
    }
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
              We're here to help! Get in touch with our support team or browse our help articles.
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                          window.location.href = 'mailto:vendoor505@gmail.com';
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Help Articles */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Help Articles & FAQs</CardTitle>
                  <p className="text-sm text-gray-600">Find detailed answers to common questions</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {helpArticles.map((topic, topicIndex) => (
                      <div key={topicIndex} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{topic.icon}</span>
                          <h3 className="text-lg font-semibold">{topic.title}</h3>
                          <Badge variant="outline">{topic.count} articles</Badge>
                        </div>
                        <div className="space-y-4 ml-8">
                          {topic.articles.map((article, articleIndex) => (
                            <div key={articleIndex} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{article.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
