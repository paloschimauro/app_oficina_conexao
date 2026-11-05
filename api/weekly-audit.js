// Weekly, read-only infrastructure audit. Scheduled Mondays at 12:00 UTC (08:00 Porto Velho).
// Only Vercel Cron (authenticated with CRON_SECRET) can run this endpoint.
const json = (data, status = 200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const timeoutFetch = (url, options = {}) => fetch(url, {...options, signal:AbortSignal.timeout(8000), cache:'no-store'});
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== 'Bearer ' + secret) return json({error:'Unauthorized'},401);
  const results=[];
  const check=(name,status,details)=>results.push({name,status,details});
  const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : new URL(request.url).origin;
  try {
    const response=await timeoutFetch(origin);
    if(response.ok){const html=await response.text();check('Aplicação web',html.includes('id="root"')&&html.includes('/assets/')?'ok':'warning',html.includes('id="root"')?'Página servida':'HTML inesperado');}
    else if([401,403].includes(response.status)) check('Aplicação web','warning','Página exige autenticação Vercel ('+response.status+'); disponibilidade pública não verificada');
    else check('Aplicação web','error','HTTP '+response.status);
  }catch(error){check('Aplicação web','error',error.name==='TimeoutError'?'Tempo limite excedido':'Falha de rede');}
  const url=process.env.VITE_SUPABASE_URL;
  const apiKey=process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !apiKey) check('Configuração Supabase','error','Variáveis de conexão ausentes');
  else {
    try {
      const response=await timeoutFetch(url+'/rest/v1/oficina_test_names?select=id,name,created_at&limit=0',{headers:{apikey:apiKey,authorization:'Bearer '+apiKey,accept:'application/json'}});
      if (!response.ok) check('API Supabase','error','Consulta de esquema retornou HTTP '+response.status);
      else {const data=await response.json();check('API Supabase',Array.isArray(data)?'ok':'warning',Array.isArray(data)?'API acessível e colunas reconhecidas':'Resposta inesperada');}
    }catch(error){check('API Supabase','error',error.name==='TimeoutError'?'Tempo limite excedido':'Resposta inválida ou falha de rede');}
  }
  check('Qualidade dos registros','info','Verificação profunda exige credenciais servidor e acesso restrito; esta auditoria não lê nomes');
  const status=results.some(x=>x.status==='error')?'error':results.some(x=>x.status==='warning')?'warning':'ok';
  const report={type:'weekly-audit',executedAt:new Date().toISOString(),status,results};
  console.log(JSON.stringify(report));
  return json(report,status==='error'?503:200);
}
