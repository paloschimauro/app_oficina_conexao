# Auditoria semanal da Oficina Conexão

- **Agendamento:** toda segunda-feira às 12:00 UTC (08:00 em Porto Velho, UTC-4).
- **Motor:** Vercel Cron Jobs, configurado em `vercel.json` e publicado somente em produção.
- **Função:** `GET /api/weekly-audit` (serverless).
- **Segurança:** valida `Authorization: Bearer <CRON_SECRET>`. O segredo está somente nas variáveis de produção da Vercel. Não invoque o endpoint sem autorização.
- **Verificações:** página web (inclusive aviso se estiver protegida), disponibilidade do Supabase REST, existência das colunas esperadas (`id`, `name`, `created_at`) sem ler registros, falhas de rede e respostas inesperadas.
- **Resultados:** objeto JSON estruturado emitido em logs da função no painel Vercel. Uma falha crítica devolve HTTP 503. Consulte **Project > Settings > Cron Jobs > View Logs**, ou **Observability > Logs** filtrando `/api/weekly-audit`.
- **Limitações:** não inspeciona dados pessoais ou integridade linha a linha, nem varre logs históricos de erro de outras funções. Também não envia e-mail automaticamente. Para isso, seria necessário backend privilegiado protegido e canal de alertas.
- **Proteção:** a função não altera dados, e execuções repetidas são idempotentes.
- **Fuso horário:** Vercel executa expressões cron em UTC; no plano Hobby a execução pode ocorrer em qualquer momento durante a hora agendada.

## Checklist pós-deploy

1. Confirmar o cron cadastrado no painel da Vercel.
2. Verificar se o segredo `CRON_SECRET` está configurado em Production.
3. Examinar o primeiro relatório na segunda-feira e validar seu resultado.
4. Caso a página esteja protegida por Vercel Authentication, o check retorna aviso, não falha.
