import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Phone, MessageCircle, Instagram, Clock, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudioConfig {
  name: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  banner_url: string;
  opening_hours: any;
}

interface ClientAboutProps {
  onSignOut?: () => void;
}

export function ClientAbout({ onSignOut }: ClientAboutProps) {
  const [studioConfig, setStudioConfig] = useState<StudioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStudioConfig();
  }, []);

  const fetchStudioConfig = async () => {
    try {
      const { data } = await supabase
        .from('studio_config')
        .select('*')
        .limit(1)
        .single();

      setStudioConfig(data);
    } catch (error) {
      console.error('Error fetching studio config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (studioConfig?.whatsapp) {
      const message = 'Olá! Gostaria de saber mais sobre os serviços.';
      const whatsappUrl = `https://wa.me/55${studioConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleInstagram = () => {
    if (studioConfig?.instagram) {
      window.open(`https://instagram.com/${studioConfig.instagram.replace('@', '')}`, '_blank');
    }
  };

  const formatDay = (day: string) => {
    const days: { [key: string]: string } = {
      monday: 'Segunda',
      tuesday: 'Terça',
      wednesday: 'Quarta',
      thursday: 'Quinta',
      friday: 'Sexta',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-beauty-black mb-2">
          {studioConfig?.name || 'Sobre Nós'}
        </h1>
        {studioConfig?.description && (
          <p className="text-muted-foreground">
            {studioConfig.description}
          </p>
        )}
      </div>

      {studioConfig?.banner_url && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <img 
            src={studioConfig.banner_url} 
            alt="Banner do estúdio"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Informações de Contato */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {studioConfig?.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{studioConfig.address}</span>
            </div>
          )}
          
          {studioConfig?.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>{studioConfig.phone}</span>
            </div>
          )}

          {studioConfig?.whatsapp && (
            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="w-full justify-start"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp: {studioConfig.whatsapp}
            </Button>
          )}

          {studioConfig?.instagram && (
            <Button
              variant="outline"
              onClick={handleInstagram}
              className="w-full justify-start"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Instagram: @{studioConfig.instagram.replace('@', '')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      {studioConfig?.opening_hours && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              <Clock className="h-5 w-5 inline mr-2" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(studioConfig.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium">{formatDay(day)}:</span>
                   <span className="text-muted-foreground">
                     {(hours as any)?.closed ? 'Fechado' : `${(hours as any)?.open} - ${(hours as any)?.close}`}
                   </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão de Sair (se logado) */}
      {user && onSignOut && (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full justify-start h-12"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}