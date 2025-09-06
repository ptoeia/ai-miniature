'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, Provider, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<any>;
  signUpWithPassword: (credentials: SignUpWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithOAuth: (provider: Provider) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Timeout wrapper for async operations
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      if (!supabase || !mounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Add timeout to getSession (5 seconds)
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          5000
        );
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, currentEventSession: Session | null) => {
            if (!mounted) return;
            
            setSession(currentEventSession);
            setUser(currentEventSession?.user ?? null);
            setError(null); // Clear any previous errors on auth state change
            
            // Adjust isLoading based on event
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED' || event === 'PASSWORD_RECOVERY') {
              setIsLoading(false);
            }
          }
        );

        setIsLoading(false);
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
        
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        
        if (!mounted) return;
        
        // Handle different types of errors
        if (error.message === 'Operation timed out') {
          setError('Connection timeout. Please check your internet connection.');
        } else if (error.message?.includes('Failed to fetch')) {
          setError('Unable to connect to authentication service. Please try again later.');
        } else {
          setError('Authentication service is currently unavailable.');
        }
        
        // Set user as not authenticated on error
        setSession(null);
        setUser(null);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const signInWithPassword = async (credentials: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword(credentials),
        10000 // 10 second timeout for login
      );
      
      if (error) {
        setIsLoading(false);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.message === 'Operation timed out') {
        setError('Login timeout. Please check your connection and try again.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
      
      throw error;
    }
  };

  const signUpWithPassword = async (credentials: SignUpWithPasswordCredentials) => {
    if (!('email' in credentials)) {
      throw new Error('Only email sign-up is supported.');
    }

    try {
      const response = await withTimeout(
        fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }),
        10000 // 10 second timeout
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred during sign-up.');
      }

      return { data: { user: null, session: null }, error: null };
    } catch (error: any) {
      if (error.message === 'Operation timed out') {
        throw new Error('Sign-up timeout. Please check your connection and try again.');
      }
      throw error;
    }
  };

  const signInWithOAuth = async (provider: Provider) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        }),
        10000 // 10 second timeout
      );
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      
      if (error.message === 'Operation timed out') {
        setError('OAuth timeout. Please check your connection and try again.');
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await withTimeout(
        supabase.auth.signOut(),
        5000 // 5 second timeout for logout
      );
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.message === 'Operation timed out') {
        setError('Logout timeout. You may already be signed out.');
        // Force local logout even if server request failed
        setSession(null);
        setUser(null);
      }
      
      throw error;
    }
  };

  const value = {
    session,
    user,
    isLoading,
    error,
    signInWithPassword,
    signUpWithPassword,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
