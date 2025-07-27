import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Star, Scissors, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import beautyLogo from '@/assets/beautybook-logo.jpg';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
}

interface ClientHomeProps {
  onAuthRequired: () => void;
  onTabChange: (tab: string) => void;
}

export function ClientHome({ onAuthRequired, onTabChange }: ClientHomeProps) {
  const { user } = useAuth();
  const [studioConfig, setStudioConfig] = useState<any>(null);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetchStudioConfig();
    fetchBanners();
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
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header com Logo */}
      <div className="text-center py-6">
        <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-4 shadow-beauty">
          <img 
            src={beautyLogo} 
            alt="BeautyBook Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold text-beauty-black mb-2">
          {studioConfig?.name || 'BeautyBook'}
        </h1>
        <p className="text-muted-foreground">
          {studioConfig?.description || 'Seu estúdio de beleza favorito'}
        </p>
      </div>

      {/* Carrossel de Banners */}
      <Card className="shadow-card overflow-hidden">
        {banners.length > 0 ? (
          <div className="aspect-video">
            <img 
              src={banners[0].image_url} 
              alt={banners[0].title || 'Banner'}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-primary flex items-center justify-center">
            <div className="text-center text-white">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Bem-vinda ao seu espaço de beleza</h2>
              <p className="text-beauty-gray">Agende seu horário e cuide de você</p>
            </div>
          </div>
        )}
      </Card>

      {/* Botão de Criar Conta ou Agendar */}
      {!user ? (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              variant="beauty" 
              size="lg" 
              className="w-full"
              onClick={onAuthRequired}
            >
              <Heart className="h-5 w-5 mr-2" />
              Criar Conta e Agendar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Button 
              variant="beauty" 
              size="lg" 
              className="w-full"
              onClick={() => onTabChange('booking')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Agendar Horário
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cards de Ações Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onTabChange('services')}>
          <CardContent className="text-center py-6">
            <Scissors className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Serviços</h3>
          </CardContent>
        </Card>
        
        <Card className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onTabChange('professionals')}>
          <CardContent className="text-center py-6">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Profissionais</h3>
          </CardContent>
        </Card>
      </div>

      {/* Card de Depoimentos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 text-primary mr-2" />
            Depoimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground italic">
              "Atendimento excepcional e profissionais super qualificados!"
            </p>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">- Cliente satisfeita</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}