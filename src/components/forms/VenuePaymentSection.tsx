
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PaymentBreakdown from '../payment/PaymentBreakdown';
import PaymentAccountSettings from '../payment/PaymentAccountSettings';
import { VenueFormData } from '@/types/venue';

interface VenuePaymentSectionProps {
  form: UseFormReturn<VenueFormData>;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  hideActions?: boolean;
}

const VenuePaymentSection: React.FC<VenuePaymentSectionProps> = ({
  form,
  userProfile,
  setUserProfile,
  hideActions = false
}) => {
  const { user } = useAuth();
  
  const watchedPricing = form.watch(['pricing_unit', 'price_per_day', 'price_per_hour']);
  const currentPrice = watchedPricing[0] === 'day' ? watchedPricing[1] : watchedPricing[2];

  const handlePaymentAccountSave = () => {
    if (user) {
      supabase
        .from('profiles')
        .select('payment_account_type, payment_account_number, payment_account_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setUserProfile(data));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {currentPrice && (
        <PaymentBreakdown
          totalAmount={currentPrice}
          showSellerView={true}
        />
      )}

      <PaymentAccountSettings
        initialData={userProfile}
        onSave={handlePaymentAccountSave}
        hideActions={hideActions}
      />
    </div>
  );
};

export default VenuePaymentSection;
