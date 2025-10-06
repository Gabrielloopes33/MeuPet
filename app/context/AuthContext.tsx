import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

import api from '../services/api';

const TOKEN_KEY = 'meupet-token';

// Definição do tipo para o contexto de autenticação
interface AuthContextType {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

// Criação do Contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Componente Provedor que envolve a aplicação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setSession(token);
        }
      } catch (e) {
        console.error('Failed to load session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const authActions = {
    signIn: async (token: string) => {
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setSession(token);
      } catch (e) {
        console.error('Failed to save session', e);
      }
    },
    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
        setSession(null);
      } catch (e) {
        console.error('Failed to clear session', e);
      }
    },
    session,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authActions}>
      {children}
    </AuthContext.Provider>
  );
}
