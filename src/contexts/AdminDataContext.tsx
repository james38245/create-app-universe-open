
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface AdminDataContextType {
  isRealTimeConnected: boolean;
  lastUpdate: Date | null;
  triggerRefresh: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  const triggerRefresh = () => {
    queryClient.invalidateQueries();
    setLastUpdate(new Date());
  };

  useEffect(() => {
    // Check admin authorization
    const adminEmail = localStorage.getItem('admin_email');
    if (adminEmail !== 'wachira18james@gmail.com') {
      return;
    }

    console.log('Setting up real-time subscriptions for admin dashboard');

    // Subscribe to all relevant table changes
    const channels = [
      // Users and profiles
      supabase
        .channel('admin-profiles-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          console.log('Profiles change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "User profiles updated",
          });
        })
        .subscribe(),

      // Venues
      supabase
        .channel('admin-venues-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'venues' }, (payload) => {
          console.log('Venues change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
          queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
          queryClient.invalidateQueries({ queryKey: ['system-stats'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Venues updated",
          });
        })
        .subscribe(),

      // Service Providers
      supabase
        .channel('admin-providers-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'service_providers' }, (payload) => {
          console.log('Service providers change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
          queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
          queryClient.invalidateQueries({ queryKey: ['system-stats'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Service providers updated",
          });
        })
        .subscribe(),

      // Bookings
      supabase
        .channel('admin-bookings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
          console.log('Bookings change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
          queryClient.invalidateQueries({ queryKey: ['system-stats'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Bookings updated",
          });
        })
        .subscribe(),

      // Transactions
      supabase
        .channel('admin-transactions-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
          console.log('Transactions change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
          queryClient.invalidateQueries({ queryKey: ['system-stats'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Transactions updated",
          });
        })
        .subscribe(),

      // Documents
      supabase
        .channel('admin-documents-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_documents' }, (payload) => {
          console.log('Documents change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Documents updated",
          });
        })
        .subscribe(),

      // Verification requests
      supabase
        .channel('admin-verification-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'verification_requests' }, (payload) => {
          console.log('Verification requests change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
          setLastUpdate(new Date());
          toast({
            title: "Real-time Update",
            description: "Verification requests updated",
          });
        })
        .subscribe(),
    ];

    // Set connection status
    setIsRealTimeConnected(true);

    return () => {
      console.log('Cleaning up real-time subscriptions');
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setIsRealTimeConnected(false);
    };
  }, [queryClient]);

  return (
    <AdminDataContext.Provider value={{
      isRealTimeConnected,
      lastUpdate,
      triggerRefresh
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};
