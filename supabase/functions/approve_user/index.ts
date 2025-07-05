import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('approve_user function called');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { email, password, name, role, subject, class: userClass } = requestBody;

    // Validate required fields
    if (!email || !name || !role) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasAnonKey: !!supabaseAnonKey
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Missing environment configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseServiceKey) {
      console.error('Missing service role key');
      return new Response(
        JSON.stringify({ error: 'Missing service role key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking if user already exists...');

    // First check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error checking existing users:', listError);
      return new Response(
        JSON.stringify({ error: `Failed to check existing users: ${listError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId: string;
    const existingUser = existingUsers.users.find(user => user.email === email);

    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      userId = existingUser.id;
    } else {
      console.log('Creating new auth user...');
      
      // Create the auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: name,
          role: role
        }
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        return new Response(
          JSON.stringify({ error: `Failed to create auth user: ${authError.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Auth user created:', authData.user?.id);
      userId = authData.user!.id;
    }

    // Create profile entry using the user's ID
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        name: name,
        role: role,
        subject: subject || null,
        class: userClass || null
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Profile created successfully:', profileData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in approve_user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});