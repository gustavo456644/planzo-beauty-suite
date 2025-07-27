import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [studioConfig, setStudioConfig] = useState<any>(null);

  useEffect(() => {
    fetchBanners();
    fetchStudioConfig();
  }, []);

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

  const fetchStudioConfig = async () => {
    try {
      const { data } = await supabase
        .from('studio_config')
        .select('*')
        .single();
      
      setStudioConfig(data);
    } catch (error) {
      console.error('Error fetching studio config:', error);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center py-6 bg-gradient-primary text-white rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">
            {studioConfig?.name || 'BeautyBook'}
          </h1>
        </div>
        <p className="text-beauty-white/80">
          {studioConfig?.description || 'Seu estúdio de beleza'}
        </p>
      </div>

      {/* Banners Carousel */}
      {banners.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Novidades</h2>
          <div className="grid gap-4">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden shadow-card">
                <CardContent className="p-0">
                  <img
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    className="w-full h-40 object-cover"
                  />
                  {banner.title && (
                    <div className="p-4">
                      <h3 className="font-medium">{banner.title}</h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Account CTA */}
      <Card className="shadow-beauty border-primary/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-beauty-black mb-2">
              Agende seu horário
            </h3>
            <p className="text-muted-foreground">
              Crie sua conta e tenha acesso completo aos nossos serviços
            </p>
          </div>
          <Button 
            variant="beauty" 
            size="lg" 
            className="w-full"
            onClick={onAuthRequired}
          >
            Criar Conta
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="shadow-card cursor-pointer hover:shadow-beauty transition-all"
          onClick={() => onTabChange('services')}
        >
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Serviços</h3>
            <p className="text-sm text-muted-foreground">Ver todos</p>
          </CardContent>
        </Card>

        <Card 
          className="shadow-card cursor-pointer hover:shadow-beauty transition-all"
          onClick={() => onTabChange('professionals')}
        >
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Profissionais</h3>
            <p className="text-sm text-muted-foreground">Conheça nosso time</p>
          </CardContent>
        </Card>
      </div>

      {/* Studio Info */}
      {studioConfig?.address && (
        <Card className="shadow-card">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Localização</h3>
            <p className="text-sm text-muted-foreground">{studioConfig.address}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}