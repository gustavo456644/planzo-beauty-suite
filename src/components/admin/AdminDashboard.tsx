import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(price)')
        .eq('appointment_date', today);

      const todayAppointments = appointments?.length || 0;
      const todayRevenue = appointments?.reduce((sum, apt) => 
        sum + (apt.total_price || apt.services?.price || 0), 0
      ) || 0;

      setStats({ todayAppointments, todayRevenue });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const copyPublicUrl = () => {
    const publicUrl = `${window.location.origin}/client`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copiado!",
      description: "O link do site público foi copiado para a área de transferência.",
    });
  };

  const openPublicSite = () => {
    window.open(`${window.location.origin}/client`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-beauty-black mb-2">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Gerencie seu estúdio de beleza
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.todayAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              agendamentos para hoje
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Estimada Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {stats.todayRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              estimativa do dia
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Site Público</CardTitle>
          <CardDescription>
            Compartilhe o link do seu site de agendamentos com os clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-beauty-gray rounded-lg">
            <code className="flex-1 text-sm text-beauty-black">
              {window.location.origin}/client
            </code>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={copyPublicUrl} 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
            <Button 
              onClick={openPublicSite} 
              variant="beauty" 
              size="sm" 
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Site
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Agenda
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}