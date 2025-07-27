import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLogin } from '@/components/AdminLogin';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Admin() {
  const { user, userRole, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'professional')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, userRole]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsLoggedIn(false);
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

  if (!isLoggedIn) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminDashboard />;
      case 'agenda':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Agenda</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'services':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Serviços</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'professionals':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Profissionais</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'menu':
        return (
          <div className="space-y-6 pb-20">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
            </div>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => alert('Em desenvolvimento')}
              >
                Configurações do Estúdio
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => alert('Em desenvolvimento')}
              >
                Relatórios Financeiros
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => alert('Em desenvolvimento')}
              >
                Feedbacks dos Clientes
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start h-12"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
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
        isAdmin={true}
      />
    </div>
  );
}