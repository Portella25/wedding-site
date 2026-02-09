-- Limpar dados existentes (opcional, cuidado em produção)
-- truncate table public.presentes cascade;
-- truncate table public.convidados cascade;

-- Inserir Presentes
insert into public.presentes (titulo, descricao, preco, imagem_url, categoria, tipo, disponivel)
values
('Jantar Romântico em Paris', 'Um jantar inesquecível na Torre Eiffel para celebrar nossa lua de mel.', 500.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', 'Lua de Mel', 'completo', true),
('Passeio de Gôndola em Veneza', 'Para curtirmos o romantismo dos canais italianos.', 350.00, 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop', 'Lua de Mel', 'completo', true),
('Cafeteira Nespresso', 'Para começarmos o dia com energia e amor.', 800.00, 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?q=80&w=2070&auto=format&fit=crop', 'Casa Nova', 'completo', true),
('Jogo de Panelas Le Creuset', 'Para preparar nossos jantares especiais.', 2500.00, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1974&auto=format&fit=crop', 'Casa Nova', 'completo', true),
('Cota para Passagens Aéreas', 'Ajude-nos a voar para o nosso destino dos sonhos.', 5000.00, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop', 'Lua de Mel', 'cota', true),
('Spa Day para os Noivos', 'Um dia de relaxamento após a festa.', 600.00, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop', 'Lua de Mel', 'completo', true);

-- Inserir Convidados de Teste
insert into public.convidados (nome, telefone, token, acompanhantes_max)
values
('Convidado VIP', '11999999999', 'VIP2026', 2),
('Família Silva', '11988888888', 'SILVA26', 4),
('Amigo Teste', '11977777777', 'TESTE01', 1);
