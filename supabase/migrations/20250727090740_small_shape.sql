/*
  # Corrigir políticas RLS para permitir criação de perfis

  1. Políticas para user_profiles
    - Permitir inserção durante registro
    - Permitir leitura do próprio perfil
    - Permitir atualização do próprio perfil

  2. Políticas para professionals
    - Permitir inserção durante registro de admin/professional
    - Permitir leitura pública
    - Permitir atualização pelo próprio usuário
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;

-- Políticas para user_profiles
CREATE POLICY "Enable insert for authentication"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para professionals
DROP POLICY IF EXISTS "Professionals are viewable by everyone" ON professionals;
DROP POLICY IF EXISTS "Users can insert professional profile" ON professionals;
DROP POLICY IF EXISTS "Users can update own professional profile" ON professionals;

CREATE POLICY "Enable insert for authentication"
  ON professionals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Professionals are viewable by everyone"
  ON professionals FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can update own professional profile"
  ON professionals FOR UPDATE
  USING (auth.uid() = user_id);