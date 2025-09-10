-- Fix infinite recursion in profiles RLS policies
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON public.profiles;

-- Create new policies that don't cause recursion
-- Use auth.jwt() to check user metadata instead of querying profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admins to view and manage all profiles using auth metadata
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  (auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin' OR auth.uid() = id)
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Allow profile creation during user signup
CREATE POLICY "Allow profile creation" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Service role bypass for admin operations
CREATE POLICY "Service role can manage profiles" 
ON public.profiles FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');