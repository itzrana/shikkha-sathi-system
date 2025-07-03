-- Fix INSERT policy to allow admins to create profiles for other users

-- Drop the current temporary policy
DROP POLICY IF EXISTS "Temporary - Allow authenticated insert" ON public.profiles;

-- Create a new policy that allows users to insert their own profile OR allows admins to insert any profile
CREATE POLICY "Users can insert own profile or admins can insert any profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = id OR is_user_admin(auth.uid())
);