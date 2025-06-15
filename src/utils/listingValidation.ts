
import * as z from 'zod';

// Enhanced validation schemas for security
export const venueValidationSchema = z.object({
  name: z.string()
    .min(3, 'Venue name must be at least 3 characters')
    .max(100, 'Venue name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-'&.,()]+$/, 'Venue name contains invalid characters'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .refine(text => !containsProfanity(text), 'Description contains inappropriate content'),
  
  location: z.string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters'),
  
  venue_type: z.string()
    .min(1, 'Venue type is required'),
  
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(50000, 'Capacity seems unrealistic')
    .int('Capacity must be a whole number'),
  
  price_per_day: z.number()
    .min(1000, 'Price must be at least KSh 1,000')
    .max(10000000, 'Price seems unrealistic'),
  
  price_per_hour: z.number()
    .min(500, 'Hourly price must be at least KSh 500')
    .max(1000000, 'Hourly price seems unrealistic')
    .optional(),
  
  amenities: z.array(z.string())
    .max(20, 'Too many amenities listed')
    .optional(),
  
  images: z.array(z.string().url('Invalid image URL'))
    .min(2, 'At least 2 images are required')
    .max(15, 'Maximum 15 images allowed'),
  
  booking_terms: z.object({
    deposit_percentage: z.number().min(0).max(100),
    payment_due_days: z.number().min(1).max(90),
    cancellation_time_value: z.number().min(1),
    refund_percentage: z.number().min(0).max(100),
  }).optional()
});

export const serviceProviderValidationSchema = z.object({
  service_category: z.string()
    .min(1, 'Service category is required')
    .refine(category => isValidServiceCategory(category), 'Invalid service category'),
  
  specialties: z.array(z.string()
    .min(2, 'Specialty must be at least 2 characters')
    .max(50, 'Specialty too long'))
    .min(1, 'At least one specialty is required')
    .max(10, 'Maximum 10 specialties allowed'),
  
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must be less than 1000 characters')
    .refine(text => !containsProfanity(text), 'Bio contains inappropriate content'),
  
  years_experience: z.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems unrealistic')
    .int('Experience must be a whole number'),
  
  price_per_event: z.number()
    .min(5000, 'Price must be at least KSh 5,000')
    .max(5000000, 'Price seems unrealistic'),
  
  price_per_hour: z.number()
    .min(1000, 'Hourly price must be at least KSh 1,000')
    .max(500000, 'Hourly price seems unrealistic')
    .optional(),
  
  portfolio_images: z.array(z.string().url('Invalid image URL'))
    .min(2, 'At least 2 portfolio images are required')
    .max(20, 'Maximum 20 portfolio images allowed'),
  
  certifications: z.array(z.string())
    .max(10, 'Maximum 10 certifications allowed')
    .optional(),
  
  response_time_hours: z.number()
    .min(1, 'Response time must be at least 1 hour')
    .max(168, 'Response time cannot exceed 1 week'),
});

// Security validation functions
const profanityWords = [
  'spam', 'scam', 'fraud', 'fake', 'illegal', 'drugs', 'weapon', 'violence'
  // Add more as needed
];

function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
}

const validServiceCategories = [
  'Catering', 'Photography', 'Videography', 'Music & DJ', 'Decoration', 
  'Security', 'Cleaning', 'Transportation', 'Entertainment', 'Planning'
];

function isValidServiceCategory(category: string): boolean {
  return validServiceCategories.includes(category);
}

// Data sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '');
}

export function sanitizeFormData(data: any): any {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    }
  });
  
  return sanitized;
}

// Image validation
export function validateImageUrl(url: string): boolean {
  const allowedDomains = [
    'supabase.co',
    'amazonaws.com',
    'cloudinary.com',
    'imagekit.io'
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

export function validateImageUrls(urls: string[]): string[] {
  return urls.filter(validateImageUrl);
}
