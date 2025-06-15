import { z } from 'zod';

export interface VenueFormData {
  id?: string;
  name: string;
  description: string;
  location: string;
  venue_type: string;
  capacity: number;
  amenities: string[];
  images: string[];
  price_per_day: number;
  price_per_hour: number;
  pricing_unit: 'day' | 'hour';
  owner_id?: string;
  blocked_dates: string[];
  booking_terms: any;
  coordinates: { lat: number; lng: number } | null;
  is_active?: boolean;
  verification_status?: 'pending' | 'under_review' | 'verified' | 'rejected';
  verification_score?: number;
  validation_notes?: string;
  security_validated?: boolean;
}

export interface ServiceProviderFormData {
  id?: string;
  user_id?: string;
  bio?: string;
  certifications?: string[];
  coordinates?: { 
    lat?: number; 
    lng?: number; 
  } | null;
  experience_years?: number;
  hourly_rate?: number;
  images?: string[];
  location?: string;
  phone?: string;
  portfolio_images?: string[];
  service_area?: string[];
  service_type?: string;
  social_links?: any;
  specialties?: string[];
  pricing_unit?: 'event' | 'hour';
  price_per_event?: number;
  price_per_hour?: number;
  blocked_dates?: string[];
  booking_terms?: any;
}

export const defaultVenueFormValues: VenueFormData = {
  name: '',
  description: '',
  location: '',
  venue_type: '',
  capacity: 0,
  amenities: [],
  images: [],
  price_per_day: 0,
  price_per_hour: 0,
  pricing_unit: 'day',
  blocked_dates: [],
  booking_terms: null,
  coordinates: null,
};

export const venueSchema = z.object({
  name: z.string().min(3, { message: 'Venue name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
  venue_type: z.string().min(3, { message: 'Venue type must be at least 3 characters.' }),
  capacity: z.number().min(1, { message: 'Capacity must be at least 1 person.' }),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  price_per_day: z.number().optional(),
  price_per_hour: z.number().optional(),
  pricing_unit: z.enum(['day', 'hour']).optional(),
  blocked_dates: z.array(z.string()).optional(),
  booking_terms: z.any().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).nullable().optional(),
  is_active: z.boolean().optional(),
  verification_status: z.string().optional(),
  verification_score: z.number().optional(),
  validation_notes: z.string().optional(),
  security_validated: z.boolean().optional(),
});
