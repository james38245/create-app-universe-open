
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I book a venue?",
                    answer: "Browse venues, select your preferred one, choose dates and services, then proceed with booking confirmation and payment."
                  },
                  {
                    question: "Can I cancel my booking?",
                    answer: "Yes, cancellation policies vary by venue. Check the specific venue's cancellation terms during booking."
                  },
                  {
                    question: "How do I contact a service provider?",
                    answer: "Visit the provider's profile page and use the messaging system to communicate directly."
                  },
                  {
                    question: "What payment methods are accepted?",
                    answer: "We accept major credit cards, debit cards, and digital payment methods. Payment options are shown during checkout."
                  },
                  {
                    question: "How do I update my profile?",
                    answer: "Go to your Profile page from the navigation menu to update your personal information and preferences."
                  },
                  {
                    question: "How do I change my notification settings?",
                    answer: "Visit the Settings page to customize your notification preferences, including email alerts and push notifications."
                  },
                  {
                    question: "Can I list my own venue?",
                    answer: "Yes! Go to 'My Listings' to add your venue with photos, descriptions, pricing, and availability."
                  },
                  {
                    question: "How do reviews work?",
                    answer: "After completing a booking, you can leave a review for the venue or service provider. Reviews help other users make informed decisions."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
