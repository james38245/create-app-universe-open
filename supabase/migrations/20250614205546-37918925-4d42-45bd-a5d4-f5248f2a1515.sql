
-- Update RLS policies to give admin users full access

-- First, create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles policies to allow admins full access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile or admins can update any" ON public.profiles 
FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can insert their own profile" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can delete any profile" ON public.profiles 
FOR DELETE USING (public.is_admin());

-- Update venues policies to allow admins full access
DROP POLICY IF EXISTS "Anyone can view active venues" ON public.venues;
DROP POLICY IF EXISTS "Venue owners can manage their venues" ON public.venues;

CREATE POLICY "Anyone can view venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Venue owners and admins can insert venues" ON public.venues 
FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Venue owners and admins can update venues" ON public.venues 
FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Admins can delete venues" ON public.venues 
FOR DELETE USING (public.is_admin());

-- Update service_providers policies to allow admins full access
DROP POLICY IF EXISTS "Anyone can view available service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers can manage their own profile" ON public.service_providers;

CREATE POLICY "Anyone can view service providers" ON public.service_providers FOR SELECT USING (true);
CREATE POLICY "Service providers and admins can insert" ON public.service_providers 
FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Service providers and admins can update" ON public.service_providers 
FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can delete service providers" ON public.service_providers 
FOR DELETE USING (public.is_admin());

-- Update bookings policies to allow admins full access
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Involved parties can update bookings" ON public.bookings;

CREATE POLICY "Users can view their bookings or admins can view all" ON public.bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT owner_id FROM public.venues WHERE id = venue_id) OR
  auth.uid() IN (SELECT user_id FROM public.service_providers WHERE id = service_provider_id) OR
  public.is_admin()
);
CREATE POLICY "Clients and admins can create bookings" ON public.bookings 
FOR INSERT WITH CHECK (auth.uid() = client_id OR public.is_admin());
CREATE POLICY "Involved parties and admins can update bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT owner_id FROM public.venues WHERE id = venue_id) OR
  auth.uid() IN (SELECT user_id FROM public.service_providers WHERE id = service_provider_id) OR
  public.is_admin()
);
CREATE POLICY "Admins can delete bookings" ON public.bookings 
FOR DELETE USING (public.is_admin());

-- Update messages policies to allow admins full access
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;

CREATE POLICY "Users can view their messages or admins can view all" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id OR public.is_admin()
);
CREATE POLICY "Users and admins can send messages" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id OR public.is_admin());
CREATE POLICY "Users and admins can update messages" ON public.messages 
FOR UPDATE USING (auth.uid() = recipient_id OR public.is_admin());
CREATE POLICY "Admins can delete messages" ON public.messages 
FOR DELETE USING (public.is_admin());

-- Update reviews policies to allow admins full access
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings or admins can create any" ON public.reviews 
FOR INSERT WITH CHECK (
  (auth.uid() = reviewer_id AND 
   EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND client_id = auth.uid())) OR
  public.is_admin()
);
CREATE POLICY "Admins can update reviews" ON public.reviews 
FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete reviews" ON public.reviews 
FOR DELETE USING (public.is_admin());
