
export const useServiceProviderTransform = () => {
  const transformProviders = (providers: any[]) => {
    return providers?.map(provider => ({
      id: provider.id,
      user_id: provider.user_id,
      business_name: provider.profiles?.full_name || provider.business_name || 'Service Provider',
      service_type: provider.service_category || 'General Services',
      location: provider.location || 'Kenya',
      base_price: provider.price_per_event || 0,
      rating: provider.rating || 0,
      total_reviews: provider.total_reviews || 0,
      description: provider.bio || 'Professional service provider',
      image_url: provider.profiles?.avatar_url || provider.image_url,
      specialties: provider.specialties || [],
      is_available: provider.is_available || false,
    })) || [];
  };

  return { transformProviders };
};
