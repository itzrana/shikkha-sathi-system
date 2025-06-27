
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        // If no profile exists, create a basic user object
        const authUser = session?.user;
        if (authUser) {
          setUser({
            id: userId,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            role: 'admin', // Default to admin for demo
            createdAt: new Date(authUser.created_at || new Date()),
            updatedAt: new Date()
          } as User);
        }
      } else {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as 'admin' | 'teacher' | 'student',
          phone: data.phone,
          class: data.class,
          subject: data.subject,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        } as User);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // Special handling for demo admin account
      if (credentials.email === 'juwelsr57@gmail.com' && credentials.password === 'admin123') {
        // Create demo admin user if doesn't exist
        const { data: existingUser } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (!existingUser.user) {
          // If user doesn't exist, create it
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
            throw signUpError;
          }

          // Create profile for the new admin user
          if (signUpData.user) {
            await supabase
              .from('profiles')
              .insert({
                id: signUpData.user.id,
                name: 'Admin User',
                email: credentials.email,
                role: 'admin'
              });
          }
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
