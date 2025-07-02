-- Temporarily allow all authenticated users to insert profiles for approval workflow
-- This is a temporary fix while we debug the admin function

-- Drop the restrictive admin policy temporarily
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create a temporary policy that allows any authenticated user to insert profiles
-- This will work for the approval workflow
CREATE POLICY "Temporary - Allow authenticated insert" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Also ensure admins can view and manage all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Re-create admin policies with a simpler approach
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);