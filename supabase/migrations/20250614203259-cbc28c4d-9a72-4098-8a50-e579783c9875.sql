
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'venue_owner', 'service_provider', 'admin')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  venue_type TEXT NOT NULL,
  amenities TEXT[],
  images TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service providers table
CREATE TABLE public.service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  price_per_event DECIMAL(10,2) NOT NULL,
  portfolio_images TEXT[] DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  certifications TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  response_time_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  service_provider_id UUID REFERENCES public.service_providers(id) ON DELETE SET NULL,
  booking_type TEXT CHECK (booking_type IN ('venue', 'service', 'both')) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  event_type TEXT NOT NULL,
  guest_count INTEGER,
  special_requirements TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  service_provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for venues
CREATE POLICY "Anyone can view active venues" ON public.venues FOR SELECT USING (is_active = true);
CREATE POLICY "Venue owners can manage their venues" ON public.venues FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for service providers
CREATE POLICY "Anyone can view available service providers" ON public.service_providers FOR SELECT USING (is_available = true);
CREATE POLICY "Service providers can manage their own profile" ON public.service_providers FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT owner_id FROM public.venues WHERE id = venue_id) OR
  auth.uid() IN (SELECT user_id FROM public.service_providers WHERE id = service_provider_id)
);
CREATE POLICY "Clients can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Involved parties can update bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT owner_id FROM public.venues WHERE id = venue_id) OR
  auth.uid() IN (SELECT user_id FROM public.service_providers WHERE id = service_provider_id)
);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND client_id = auth.uid())
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update venue ratings
CREATE OR REPLACE FUNCTION public.update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.venues 
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE venue_id = NEW.venue_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE venue_id = NEW.venue_id)
  WHERE id = NEW.venue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for venue rating updates
CREATE TRIGGER update_venue_rating_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW 
  WHEN (NEW.venue_id IS NOT NULL)
  EXECUTE FUNCTION public.update_venue_rating();

-- Create function to update service provider ratings
CREATE OR REPLACE FUNCTION public.update_service_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.service_providers 
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE service_provider_id = NEW.service_provider_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE service_provider_id = NEW.service_provider_id)
  WHERE id = NEW.service_provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for service provider rating updates
CREATE TRIGGER update_service_provider_rating_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW 
  WHEN (NEW.service_provider_id IS NOT NULL)
  EXECUTE FUNCTION public.update_service_provider_rating();
