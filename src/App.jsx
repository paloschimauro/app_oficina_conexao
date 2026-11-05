import { useState } from 'react';
import { supabase } from './supabase';

const menu = [{id:'inicio',label:'Início',icon:'⌂'},{id:'cadastro',label:'Cadastrar nome',icon:'✎'},{id:'atividade',label:'Atividade',icon:'▤'},{id:'configuracoes',label:'Configurações',icon:'⚙'}];

function App(){
 const [page,setPage]=useState('cadastro');
 const [name,setName]=useState('');
 const [status,setStatus]=useState({type:'',message:''});
 const [saving,setSaving]=useState(false);
 const [sidebarOpen,setSidebarOpen]=useState(false);
 const navigate=(id)=>{setPage(id);setSidebarOpen(false);setStatus({type:'',message:''});};
 async function saveName(e){
  e.preventDefault(); const normalized=name.trim();
  if(!normalized || normalized.length>80){setStatus({type:'error',message:'Informe um nome de 1 a 80 caracteres.'});return;}
  if(!supabase){setStatus({type:'error',message:'A conexão Supabase ainda não foi configurada na Vercel.'});return;}
  setSaving(true);setStatus({type:'',message:''});
  try{const {error}=await supabase.from('oficina_test_names').insert({name:normalized});if(error)throw error;setName('');setStatus({type:'success',message:'Nome salvo no Supabase com sucesso!'});}
  catch(error){console.error('Falha ao salvar no Supabase:',error);setStatus({type:'error',message:'Não foi possível salvar. Verifique a conexão e tente novamente.'});}
  finally{setSaving(false);}
 }
 const selected=menu.find(item=>item.id===page);
 return <div className="shell">
  {sidebarOpen && <button className="overlay" aria-label="Fechar menu" onClick={()=>setSidebarOpen(false)}/>}
  <aside className={'sidebar '+(sidebarOpen?'is-open':'')}>
   <div className="side-logo"><div className="logo-mark">OC</div><div><strong>OFICINA</strong><span>CONEXÃO</span></div></div>
   <p className="nav-caption">ESPAÇO DE TRABALHO</p>
   <nav aria-label="Menu lateral">{menu.map(item=><button key={item.id} className={'nav-link '+(page===item.id?'active':'')} onClick={()=>navigate(item.id)}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}{page===item.id&&<span className="nav-dot"/>}</button>)}</nav>
   <div className="side-bottom"><div className="avatar">T</div><div><strong>Ambiente de teste</strong><small>Protótipo React</small></div><span className="online-dot" aria-label="Protótipo ativo"/></div>
  </aside>
  <div className="workspace">
   <header className="topbar"><div className="top-left"><button className="menu-toggle" onClick={()=>setSidebarOpen(true)} aria-label="Abrir menu">☰</button><span className="breadcrumb">Workspace <span>/</span> {selected.label}</span></div><div className="top-right"><span className="environment"><span className="live-dot"/> Ambiente de teste</span><div className="header-avatar">T</div></div></header>
   <main className="content"><div className="page-intro"><div className="eyebrow"><span className="eyebrow-dot"/> PROTÓTIPO FUNCIONAL <span className="eyebrow-divider">/</span> VERSÃO 0.1</div><h1>{page==='cadastro'?'Cadastro de nome':selected.label}</h1><p>{page==='cadastro'?'Uma interface simples para validar a integração entre React, Supabase e Vercel.':'Esta seção é apenas uma demonstração de navegação. Escolha “Cadastrar nome” para testar o banco de dados.'}</p></div>
   {page==='cadastro'?<div className="content-grid"><section className="form-card"><div className="card-header"><div className="card-icon">✎</div><div><h2>Novo registro</h2><p>Preencha o campo abaixo para realizar o teste.</p></div></div><form onSubmit={saveName}><label htmlFor="name">Nome completo <span className="required">*</span></label><input id="name" name="name" autoComplete="name" placeholder="Digite seu nome aqui" value={name} onChange={e=>{setName(e.target.value);setStatus({type:'',message:''});}} maxLength={80} required/><small className="field-help">Esse nome será enviado ao banco de dados Supabase.</small><button className="save-button" type="submit" disabled={saving||!name.trim()}>{saving?'Salvando...':'Salvar nome'}<span aria-hidden="true">→</span></button>{status.message&&<p className={'feedback '+status.type} role="status">{status.message}</p>}</form></section><aside className="info-card"><div className="info-icon">↗</div><div><h3>Teste de integração</h3><p>Este formulário envia um registro real para uma tabela de demonstração no Supabase.</p></div><div className="stack-list"><div><span className="stack-symbol">◈</span><span>React + Vite</span><span className="stack-label">Interface</span></div><div><span className="stack-symbol">▦</span><span>Supabase</span><span className="stack-label">Banco de dados</span></div><div><span className="stack-symbol">▲</span><span>Vercel</span><span className="stack-label">Hospedagem</span></div></div><p className="info-note">O menu é demonstrativo. Apenas o formulário realiza uma operação de banco de dados.</p></aside></div>:<section className="placeholder-card"><div className="placeholder-icon">{selected.icon}</div><h2>{selected.label}</h2><p>Visualização simulada para testar a navegação do aplicativo.</p><button className="ghost-button" onClick={()=>navigate('cadastro')}>Ir para o cadastro →</button></section>}
   </main>
   <footer className="footer"><span>© 2026 Oficina Conexão <span className="footer-sep">·</span> Demonstração</span><nav aria-label="Menu do rodapé"><button onClick={()=>navigate('inicio')}>Início</button><button onClick={()=>navigate('cadastro')}>Cadastro</button><button onClick={()=>navigate('configuracoes')}>Configurações</button></nav><span className="footer-version">v0.1.0 <span className="footer-sep">·</span> React</span></footer>
  </div>
 </div>;
}
export default App;
