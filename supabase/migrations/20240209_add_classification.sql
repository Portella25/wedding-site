-- Adiciona coluna de classificação na tabela de convidados
ALTER TABLE public.convidados ADD COLUMN IF NOT EXISTS classificacao text DEFAULT 'Convidado';

-- Valida os valores permitidos (opcional, mas boa prática)
ALTER TABLE public.convidados DROP CONSTRAINT IF EXISTS convidados_classificacao_check;
ALTER TABLE public.convidados ADD CONSTRAINT convidados_classificacao_check 
  CHECK (classificacao IN ('Familia', 'Convidado', 'Padrinhos', 'Padrinho', 'Madrinha'));
