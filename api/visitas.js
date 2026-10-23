import {get, list, put} from '@vercel/blob';
import {createHash} from 'node:crypto';

const PREFIX='dea-visitas/v4/',BASE='dea-visitas/v3/contador.json';
const dayOf=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
const exists=e=>e?.status===409||e?.statusCode===409||/already exists/i.test(e?.message||'');

// Immutable visit files: no shared-file overwrite, ETag or update contention.
// The previous aggregate is read only and remains the historical baseline.
export function createHandler({storage={get,list,put},clock=Date.now,configured=()=>Boolean(process.env.BLOB_READ_WRITE_TOKEN||process.env.BLOB_STORE_ID)}={}){
 let baselinePromise,cached;
 async function scan(prefix){const blobs=[];let cursor;do{const page=await storage.list({prefix,limit:1000,...(cursor?{cursor}:{})});blobs.push(...page.blobs);cursor=page.hasMore?page.cursor:undefined}while(cursor);return blobs}
 async function baseline(){
  baselinePromise ||= (async()=>{
   const file=await storage.get(BASE,{access:'private',useCache:false});
   if(file){const state=await new Response(file.stream).json();if(state.version!==3||!Number.isSafeInteger(state.total)||state.total<0||!state.days)throw Error('Invalid historical count');return {total:state.total,days:state.days}}
   const state={total:0,days:{}};
   for(const prefix of ['dea-visitas/v1/','dea-visitas/v2/'])for(const blob of await scan(prefix)){state.total++;const date=blob.pathname.match(/\/(\d{4}-\d{2}-\d{2})\//)?.[1];if(date)state.days[date]=(state.days[date]||0)+1}
   return state;
  })().catch(e=>{baselinePromise=null;throw e});return baselinePromise;
 }
 async function count(){const previous=await baseline(),today=dayOf(clock()),files=await scan(PREFIX);const data={total:previous.total+files.length,hoy:(previous.days[today]||0)+files.filter(b=>b.pathname.startsWith(PREFIX+today+'/')).length,fecha:today,zona:'Europe/Madrid',criterio:'Cada entrada o recarga de la página cuenta una visita'};cached={data,at:clock()};return data}
 return async function handler(req,res){
  function send(status,data){res.status(status);res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');if(status===200&&req.method==='GET')res.setHeader('Vercel-CDN-Cache-Control','public, s-maxage=60');res.end(JSON.stringify(data))}
    const origin=req.headers?.origin,allowed=!origin||origin==='https://dea-habbo-es.vercel.app'||origin==='https://pitersc10.github.io'||origin==='https://'+req.headers?.host;
  if(!allowed)return send(403,{error:'Origen no permitido'});
  // Public totals only; no credentials, user records or private panel data.
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Max-Age','86400');
  if(req.method==='OPTIONS'){res.status(204);return res.end()}
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST, OPTIONS');return send(405,{error:'Método no permitido'})}
  if(!configured())return send(503,{error:'Contador no configurado'});
  const token=req.body?.session;
  if(req.method==='POST'&&(typeof token!=='string'||!/^[a-f0-9]{32}$/.test(token)))return send(400,{error:'Identificador inválido'});
  try{
   if(req.method==='GET')return send(200,cached&&clock()-cached.at<60000&&cached.data.fecha===dayOf(clock())?cached.data:await count());
   await baseline(); // Never add a visit if its historical baseline cannot be read.
   const id=createHash('sha256').update(token).digest('hex'),path=PREFIX+dayOf(clock())+'/'+id+'.json';let registered=true;
   try{await storage.put(path,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'})}catch(e){if(!exists(e))throw e;registered=false}
   return send(200,{...await count(),registrada:registered});
  }catch(e){console.error('DEA visits:',e?.constructor?.name||'StorageError');return send(503,{error:'No se pudieron consultar las visitas'})}
 };
}
export default createHandler();
