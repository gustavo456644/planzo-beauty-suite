import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: string;
  service_categories?: {
    name: string;
  };
}

export function ClientServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select(`
          *,
          service_categories(name)
        `)
        .eq('is_active', true)
        .order('name');

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando serviços...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Nenhum serviço disponível</h2>
        <p className="text-muted-foreground">
          Os serviços serão configurados pelo administrador
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-beauty-black mb-2">
          Nossos Serviços
        </h1>
        <p className="text-muted-foreground">
          Conheça todos os serviços disponíveis
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id} className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  {service.description && (
                    <CardDescription className="mt-2">
                      {service.description}
                    </CardDescription>
                  )}
                </div>
                {service.service_categories && (
                  <Badge variant="secondary" className="ml-2">
                    {service.service_categories.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} min
                  </div>
                </div>
                <div className="flex items-center text-lg font-bold text-primary">
                  <DollarSign className="h-4 w-4 mr-1" />
                  R$ {service.price.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}