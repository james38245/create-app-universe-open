
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpCircle, Search, ChevronDown, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqCategories = [
    {
      category: 'Booking & Payments',
      icon: '💳',
      questions: [
        {
          id: 'booking-1',
          question: 'How do I book a venue or service?',
          answer: 'Browse our venues or service providers, select your preferred option, choose your date and package, then complete the booking through our secure payment system using M-Pesa.'
        },
        {
          id: 'booking-2',
          question: 'What payment methods do you accept?',
          answer: 'We currently accept M-Pesa payments. All transactions are secure and processed instantly. You can pay the full amount upfront or choose our installment options for certain bookings.'
        },
        {
          id: 'booking-3',
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel your booking. Cancellation policies vary by venue/service provider. Generally, cancellations made 48-72 hours before the event are eligible for refunds minus transaction fees.'
        },
        {
          id: 'booking-4',
          question: 'How much commission does Vendoor charge?',
          answer: 'Vendoor charges a 10% platform commission plus a 3% transaction fee. These fees are automatically deducted from the total amount, and the remaining amount is transferred to the service provider.'
        }
      ]
    },
    {
      category: 'For Service Providers',
      icon: '🏢',
      questions: [
        {
          id: 'provider-1',
          question: 'How do I become a service provider on Vendoor?',
          answer: 'Sign up for an account, complete your profile, upload your CV/resume and certifications, then apply to become a service provider. Our team will review your application within 24-48 hours.'
        },
        {
          id: 'provider-2',
          question: 'How do I receive payments?',
          answer: 'Payments are automatically transferred to your registered M-Pesa or bank account 24-48 hours after the refund deadline expires. Make sure your payment details are accurate to avoid delays.'
        },
        {
          id: 'provider-3',
          question: 'Can I set my own prices?',
          answer: 'Yes, you have full control over your pricing. You can set different rates for different services, offer package deals, and update your prices anytime through your listings dashboard.'
        },
        {
          id: 'provider-4',
          question: 'How do I manage my bookings?',
          answer: 'Use the "My Listings" section to view and manage all your bookings. You can see upcoming events, communicate with clients, and update your availability calendar.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      icon: '👤',
      questions: [
        {
          id: 'account-1',
          question: 'How do I update my profile information?',
          answer: 'Go to your Profile page from the account dropdown menu. Click "Edit" to update your personal information, bio, contact details, and profile picture.'
        },
        {
          id: 'account-2',
          question: 'How do I change my password?',
          answer: 'Currently, password changes are handled through the "Forgot Password" link on the login page. We\'re working on adding a direct password change option in Settings.'
        },
        {
          id: 'account-3',
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion by contacting our support team. Please note that this action is irreversible and will remove all your data from our system.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: '🔧',
      questions: [
        {
          id: 'tech-1',
          question: 'I\'m having trouble making a payment',
          answer: 'Ensure you have sufficient M-Pesa balance and that your phone number is correctly entered. If issues persist, try refreshing the page or contact M-Pesa customer support.'
        },
        {
          id: 'tech-2',
          question: 'The website is not loading properly',
          answer: 'Try clearing your browser cache, disabling ad blockers, or using a different browser. If problems continue, the issue might be on our end - please contact support.'
        },
        {
          id: 'tech-3',
          question: 'I can\'t upload my documents',
          answer: 'Ensure your files are in PDF, JPG, or PNG format and under 5MB each. Check your internet connection and try uploading one file at a time.'
        }
      ]
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions about using Vendoor for your event planning needs
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <Card key={category.category} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {category.questions.map((faq) => (
                    <Collapsible
                      key={faq.id}
                      open={openItems.includes(faq.id)}
                      onOpenChange={() => toggleItem(faq.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-6 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            {openItems.includes(faq.id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Still Need Help */}
          <Card className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="mb-6 text-purple-100">
                Can't find the answer you're looking for? Our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/support">
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={() => window.location.href = 'tel:+254700000000'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
