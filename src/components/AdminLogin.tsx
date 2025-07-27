import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, { name, role: 'admin' });
        
        if (error) {
          toast({
            title: "Erro no cadastro",
            description: error,
            variant: "destructive",
          });
          return;
        }

        // Após criar conta admin, fazer login automaticamente
        const { error: loginError } = await signIn(email, password);
        
        if (loginError) {
          toast({
            title: "Conta criada, mas erro no login",
            description: "Tente fazer login manualmente.",
            variant: "destructive",
          });
          setIsSignUp(false);
          setName('');
          setPassword('');
          return;
        }
        
        // Login bem-sucedido, onSuccess será chamado
        onSuccess();
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Erro no login",
            description: error,
            variant: "destructive",
          });
          return;
        }
        
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-float">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-beauty">
            <Scissors className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-beauty-black">
              {isSignUp ? 'Criar Conta Admin' : 'Painel Administrativo'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'Crie sua conta de administrador' : 'Faça login para gerenciar seu estúdio'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="h-12"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                ? (isSignUp ? 'Criando conta...' : 'Entrando...') 
                : (isSignUp ? 'Criar conta' : 'Entrar')
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary"
            >
              {isSignUp 
                ? 'Já tem conta? Fazer login' 
                : 'Não tem conta? Criar conta'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}