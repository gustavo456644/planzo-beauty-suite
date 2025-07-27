import { Home, Calendar, Scissors, Users, Menu, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, isAdmin = false }: BottomNavigationProps) {
  const adminTabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
    { id: 'services', icon: Scissors, label: 'Serviços' },
    { id: 'professionals', icon: Users, label: 'Profissionais' },
    { id: 'menu', icon: Menu, label: 'Menu' },
  ];

  const clientTabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'booking', icon: Calendar, label: 'Agendar' },
    { id: 'appointments', icon: Calendar, label: 'Meus Agendamentos' },
    { id: 'services', icon: Scissors, label: 'Serviços' },
    { id: 'professionals', icon: Users, label: 'Profissionais' },
    { id: 'about', icon: Star, label: 'Sobre' },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-5 md:grid-cols-6 gap-1 p-2 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeTab === id ? "beauty" : "ghost"}
            size="sm"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center justify-center h-14 px-2 py-1 text-xs",
              activeTab === id && "text-beauty-white"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-none">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}