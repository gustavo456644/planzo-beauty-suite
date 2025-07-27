import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo & Title */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">BeautyBook</h1>
            <p className="text-white/80 text-lg">
              Sistema de Agendamento para Estúdios de Beleza
            </p>
          </div>
        </div>

        {/* Access Cards */}
        <div className="space-y-4">
          <Card className="shadow-float border-none">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-lg">Clientes</CardTitle>
                  <CardDescription>
                    Agende seus horários de beleza
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/client">
                <Button variant="beauty" size="lg" className="w-full">
                  Acessar como Cliente
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-float border-none">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-beauty-black rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-lg">Administrador</CardTitle>
                  <CardDescription>
                    Gerencie seu estúdio
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/admin">
                <Button variant="secondary" size="lg" className="w-full">
                  Painel Administrativo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm">
          <p>BeautyBook © 2024</p>
          <p>Transformando a beleza em experiência digital</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
