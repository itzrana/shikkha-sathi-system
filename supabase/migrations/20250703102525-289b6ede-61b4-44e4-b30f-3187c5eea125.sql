-- Fix infinite recursion in RLS policies by using security definer function

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Re-create admin policies using the existing is_user_admin function to avoid recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (is_user_admin(auth.uid()));