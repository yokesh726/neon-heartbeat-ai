-- Add Ready Player Me avatar URL field to profiles
ALTER TABLE public.profiles 
ADD COLUMN avatar_glb_url text;

COMMENT ON COLUMN public.profiles.avatar_glb_url IS 'URL to Ready Player Me .glb avatar model';