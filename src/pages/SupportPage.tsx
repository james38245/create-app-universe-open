
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupportHeader from '@/components/support/SupportHeader';
import SupportChannels from '@/components/support/SupportChannels';
import HelpArticles from '@/components/support/HelpArticles';
import SupportSidebar from '@/components/support/SupportSidebar';
import PaymentsTab from '@/components/support/PaymentsTab';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <SupportHeader />

          <Tabs defaultValue="support" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="support">Support & Help</TabsTrigger>
              <TabsTrigger value="payments">Payments & Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="support">
              <SupportChannels />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <HelpArticles />
                </div>
                <SupportSidebar />
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
