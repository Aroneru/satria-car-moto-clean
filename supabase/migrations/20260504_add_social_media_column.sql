-- Add social_media column to contact_info table
ALTER TABLE public.contact_info
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '[]'::jsonb;
