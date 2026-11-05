# Oficina Conexão — teste de integração

Aplicativo demonstrativo em React + Vite + Supabase, pronto para implantação na Vercel. Contém um único formulário de nome e navegação mockada (header, sidebar, footer). O formulário faz INSERT em `public.oficina_test_names`; os demais menus são simulações.

## Iniciar

1. Execute `npm install`.
2. Copie `.env.example` para `.env.local` e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Execute `npm run dev`.
4. Valide com `npm run build`.

Na Vercel, configure as mesmas variáveis para Production, Preview e Development e execute um novo deploy após salvá-las. O framework é Vite e o diretório de saída é `dist`.

## Segurança

A tabela tem RLS ativado, com permissão somente para INSERT pelos papéis `anon` e `authenticated`. Não há acesso de leitura pública; evite usar nomes reais ou dados pessoais neste ambiente de demonstração. **Jamais use uma service_role ou secret key no frontend.** Não há autenticação nem limite de requisições: para produção, adicione autenticação, proteção contra abuso e políticas por usuário.
