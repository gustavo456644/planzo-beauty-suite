import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();
              
              setUserRole(profile?.role || 'client');
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('client');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role for existing session
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            setUserRole(profile?.role || 'client');
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole('client');
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Erro inesperado ao fazer login' };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || 'client',
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Este email já está cadastrado' };
        }
        return { error: error.message };
      }

      // Para admin, não mostra toast pois vai fazer login automaticamente
      if (userData.role !== 'admin') {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login na sua conta.",
        });
      }

      return {};
    } catch (error) {
      return { error: 'Erro inesperado ao criar conta' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      userRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}