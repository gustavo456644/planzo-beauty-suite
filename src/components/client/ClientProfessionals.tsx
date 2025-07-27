import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  specialty: string;
  bio: string;
  is_available: boolean;
  user_profiles: {
    name: string;
    phone: string;
    avatar_url: string;
  };
}

export function ClientProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const { data } = await supabase
        .from('professionals')
        .select(`
          *,
          user_profiles(name, phone, avatar_url)
        `)
        .eq('is_available', true);

      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    if (phone) {
      const message = `Olá ${name}! Gostaria de saber mais sobre seus serviços.`;
      const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando profissionais...</p>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-20">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Nenhum profissional disponível</h2>
        <p className="text-muted-foreground">
          Os profissionais serão configurados pelo administrador
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-beauty-black mb-2">
          Nossa Equipe
        </h1>
        <p className="text-muted-foreground">
          Conheça nossos profissionais especializados
        </p>
      </div>

      <div className="space-y-4">
        {professionals.map((professional) => (
          <Card key={professional.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={professional.user_profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {professional.user_profiles?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {professional.user_profiles?.name}
                  </CardTitle>
                  {professional.specialty && (
                    <Badge variant="secondary" className="mt-1">
                      {professional.specialty}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            {(professional.bio || professional.user_profiles?.phone) && (
              <CardContent className="space-y-4">
                {professional.bio && (
                  <CardDescription>{professional.bio}</CardDescription>
                )}
                {professional.user_profiles?.phone && (
                  <Button
                    variant="outline"
                    onClick={() => handleWhatsApp(
                      professional.user_profiles.phone,
                      professional.user_profiles.name
                    )}
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conversar no WhatsApp
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}