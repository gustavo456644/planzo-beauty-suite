import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientAuthProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onBack: () => void;
}

export function ClientAuth({ mode, onModeChange, onBack }: ClientAuthProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Erro no login",
            description: error,
            variant: "destructive",
          });
          return;
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
        });
        
        if (error) {
          toast({
            title: "Erro no cadastro",
            description: error,
            variant: "destructive",
          });
          return;
        }

        // Switch to login mode after successful signup
        onModeChange('login');
        setFormData({ name: '', email: '', phone: '', password: '' });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-float">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 text-beauty-black hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-beauty">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-beauty-black">
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {mode === 'login' 
                ? 'Acesse sua conta para agendar' 
                : 'Crie sua conta para começar a agendar'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      phone: formatPhone(e.target.value) 
                    })}
                    placeholder="(11) 99999-9999"
                    required
                    className="h-12"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              variant="beauty" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') 
                : (mode === 'login' ? 'Entrar' : 'Criar conta')
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-primary"
            >
              {mode === 'login' 
                ? 'Não tem conta? Criar conta' 
                : 'Já tem conta? Fazer login'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}