
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        // If no profile exists, create a basic user object from session
        if (session?.user) {
          const basicUser: User = {
            id: userId,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: 'admin', // Default to admin for demo
            createdAt: new Date(session.user.created_at || new Date()),
            updatedAt: new Date()
          };
          setUser(basicUser);
          setIsAuthenticated(true);
        }
      } else {
        console.log('Profile data:', data);
        const profileUser: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as 'admin' | 'teacher' | 'student',
          class: data.class || undefined,
          subject: data.subject || undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        setUser(profileUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Still set a basic user to prevent infinite loading
      if (session?.user) {
        const basicUser: User = {
          id: userId,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: 'admin',
          createdAt: new Date(session.user.created_at || new Date()),
          updatedAt: new Date()
        };
        setUser(basicUser);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // Special handling for demo admin account
      if (credentials.email === 'juwelsr57@gmail.com' && credentials.password === 'admin123') {
        try {
          // Try to sign in first
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });

          if (signInError && signInError.message.includes('Invalid login credentials')) {
            console.log('Creating demo admin account...');
            // If sign in fails, try to create the account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: credentials.email,
              password: credentials.password,
              options: {
                data: {
                  name: 'Admin User',
                  role: 'admin'
                }
              }
            });

            if (signUpError) {
              console.error('Sign up error:', signUpError);
              throw signUpError;
            }

            console.log('Demo admin account created:', signUpData);

            // Create profile for the new admin user
            if (signUpData.user) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: signUpData.user.id,
                  name: 'Admin User',
                  email: credentials.email,
                  role: 'admin'
                });

              if (profileError) {
                console.error('Profile creation error:', profileError);
              }

              // Set user data immediately for demo
              const demoUser: User = {
                id: signUpData.user.id,
                email: credentials.email,
                name: 'Admin User',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              setUser(demoUser);
              setIsAuthenticated(true);
            }
          } else if (signInError) {
            throw signInError;
          }
        } catch (adminError) {
          console.error('Admin login error:', adminError);
          throw adminError;
        }
      } else {
        // Regular login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (error) {
          throw error;
        }
      }

      // User profile will be fetched in the auth state change listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser, updatedAt: new Date() };
      setUser(newUser);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
