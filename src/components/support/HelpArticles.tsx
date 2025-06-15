
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const HelpArticles = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const helpArticles = [
    {
      title: 'Booking Issues',
      count: 3,
      icon: '📅',
      articles: [
        {
          id: 1,
          title: 'How to book a venue or service',
          content: 'Step-by-step guide: 1) Browse venues or service providers, 2) Select your preferred option, 3) Choose date and time, 4) Fill in booking details, 5) Confirm payment method, 6) Complete booking. You\'ll receive a confirmation email immediately.',
          link: '/help/booking-guide'
        },
        {
          id: 2,
          title: 'Modifying or canceling bookings',
          content: 'To modify a booking: Go to "My Bookings" in your profile, find the booking, and click "Modify". For cancellations: Click "Cancel Booking" - refund eligibility depends on the cancellation policy of the service provider.',
          link: '/help/modify-cancel-booking'
        },
        {
          id: 3,
          title: 'Booking confirmation issues',
          content: 'If you don\'t receive a booking confirmation: 1) Check your spam folder, 2) Verify your email address in profile settings, 3) Contact the service provider directly, 4) Check "My Bookings" section in your profile for booking status.',
          link: '/help/booking-confirmation'
        }
      ]
    },
    {
      title: 'Payment Problems',
      count: 3,
      icon: '💳',
      articles: [
        {
          id: 4,
          title: 'Payment methods accepted',
          content: 'We accept: M-Pesa, Visa, Mastercard, and bank transfers. All payments are processed securely through our payment partners. Your card details are never stored on our servers.',
          link: '/help/payment-methods'
        },
        {
          id: 5,
          title: 'Payment failed or declined',
          content: 'Common solutions: 1) Check if your card has sufficient funds, 2) Verify card details are correct, 3) Contact your bank for international transactions, 4) Try a different payment method, 5) Clear browser cache and try again.',
          link: '/help/payment-failed'
        },
        {
          id: 6,
          title: 'Refund process and timeline',
          content: 'Refunds are processed according to the service provider\'s policy. Typically: 1) Request refund through "My Bookings", 2) Service provider reviews within 24-48 hours, 3) Approved refunds take 3-7 business days to reflect in your account.',
          link: '/help/refund-process'
        }
      ]
    },
    {
      title: 'Account Questions',
      count: 2,
      icon: '👤',
      articles: [
        {
          id: 7,
          title: 'Creating and verifying your account',
          content: 'Sign up with email and password. Verify your email by clicking the link sent to your inbox. Complete your profile with accurate information. Service providers need additional verification for listing services.',
          link: '/help/account-setup'
        },
        {
          id: 8,
          title: 'Password reset and security',
          content: 'Forgot password? Click "Forgot Password" on login page. Enter your email to receive reset instructions. For security: use strong passwords, enable two-factor authentication if available, and never share login details.',
          link: '/help/password-security'
        }
      ]
    }
  ];

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  return (
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
              <div className="space-y-3 ml-8">
                {topic.articles.map((article, articleIndex) => (
                  <div key={articleIndex} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{article.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openArticle(article)}
                        className="ml-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedArticle(null)}
                >
                  ×
                </Button>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedArticle(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default HelpArticles;
