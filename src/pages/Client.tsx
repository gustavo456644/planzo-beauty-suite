import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ClientAuth } from '@/components/ClientAuth';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ClientHome } from '@/components/client/ClientHome';
import { ClientServices } from '@/components/client/ClientServices';
import { ClientProfessionals } from '@/components/client/ClientProfessionals';
import { ClientAbout } from '@/components/client/ClientAbout';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Client() {
  const { user, userRole, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAuth, setShowAuth] = useState(false);

  const isClientLoggedIn = user && userRole === 'client';

  const handleAuthRequired = () => {
    setShowAuth(true);
  };

  const handleAuthBack = () => {
    setShowAuth(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showAuth && !isClientLoggedIn) {
    return (
      <ClientAuth 
        mode={authMode} 
        onModeChange={setAuthMode}
        onBack={handleAuthBack}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ClientHome 
            onAuthRequired={handleAuthRequired}
            onTabChange={setActiveTab}
          />
        );
      case 'booking':
        if (!isClientLoggedIn) {
          handleAuthRequired();
          return null;
        }
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Agendar Horário</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'appointments':
        if (!isClientLoggedIn) {
          handleAuthRequired();
          return null;
        }
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Meus Agendamentos</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'services':
        return <ClientServices />;
      case 'professionals':
        return <ClientProfessionals />;
      case 'about':
        return <ClientAbout onSignOut={handleSignOut} />;
      default:
        return (
          <ClientHome 
            onAuthRequired={handleAuthRequired}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-md">
        {renderContent()}
      </div>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAdmin={false}
      />
    </div>
  );
}