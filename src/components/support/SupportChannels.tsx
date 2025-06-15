
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock } from 'lucide-react';

const SupportChannels = () => {
  const supportChannels = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support experts',
      availability: '+254 794 796 922',
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

  return (
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
                    window.location.href = 'tel:+254794796922';
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
  );
};

export default SupportChannels;
