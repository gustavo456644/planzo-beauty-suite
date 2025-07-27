/*
  # Trigger para criar perfil de usuário automaticamente

  1. Função para criar perfil
    - Cria perfil automaticamente quando usuário se registra
    - Usa dados do auth.users.raw_user_meta_data
    - Define role baseado nos metadados

  2. Trigger
    - Executa após inserção em auth.users
    - Chama função de criação de perfil
*/

-- Função para criar perfil de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    name,
    phone,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
  );
  
  -- Se for admin ou professional, criar registro na tabela professionals
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') IN ('admin', 'professional') THEN
    INSERT INTO public.professionals (user_id, specialty, bio, is_available)
    VALUES (NEW.id, 'Administrador', 'Administrador do sistema', true);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();