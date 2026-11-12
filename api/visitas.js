// Public aggregate counter. All durable data lives in the existing DEA Sheets backend.
const BACKEND='https://script.google.com/macros/s/AKfycbyhGqAW8AiwHt11JBT3jmf2In5do2MRpO-H_urxftlewpJgvmWdQV3mrbQQdtOnYndNEg/exec';
const validCount=n=>Number.isSafeInteger(n)&&n>=0;
export function createHandler({fetcher=fetch,endpoint=BACKEND}={}){
 return async function handler(req,res){
  const send=(status,data)=>{res.status(status);res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');if(status===200&&req.method==='GET')res.setHeader('Vercel-CDN-Cache-Control','public, s-maxage=60');res.end(JSON.stringify(data));};
  const origin=req.headers?.origin;
  if(origin&&!['https://dea-habbo-es.vercel.app','https://pitersc10.github.io','https://'+req.headers?.host].includes(origin))return send(403,{error:'Origen no permitido'});
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Max-Age','86400');
  if(req.method==='OPTIONS'){res.status(204);return res.end();}
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST, OPTIONS');return send(405,{error:'Método no permitido'});}
  const token=req.body?.session;
  if(req.method==='POST'&&(typeof token!=='string'||!/^[a-f0-9]{32}$/.test(token)))return send(400,{error:'Identificador inválido'});
  const url=new URL(endpoint);url.searchParams.set('public','visitas');
  if(req.method==='POST')url.searchParams.set('session',token);
  if(req.method==='GET'&&req.query?.stats==='1')url.searchParams.set('stats','1');
  try{
   const response=await fetcher(url,{redirect:'follow',signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('Backend unavailable');
   const data=await response.json();
   if(data.error||!validCount(data.total)||!validCount(data.hoy)||data.hoy>data.total||!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha)||typeof data.historicoCompleto!=='boolean')throw Error('Invalid aggregate');
   const out={total:data.total,hoy:data.hoy,fecha:data.fecha,zona:'Europe/Madrid',historicoCompleto:data.historicoCompleto,criterio:'Cada entrada o recarga de la página cuenta una visita'};
   if(req.method==='POST'){if(typeof data.registrada!=='boolean')throw Error('Missing write confirmation');out.registrada=data.registrada;}
   if(url.searchParams.has('stats')){if(!Array.isArray(data.historial)||data.historial.length>7300||!data.historial.every(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.fecha)&&validCount(r.visitas)))throw Error('Invalid history');out.historial=data.historial.map(r=>({fecha:r.fecha,visitas:r.visitas}));out.desde=data.desde;out.historialCompleto=data.historialCompleto===true;}
   return send(200,out);
  }catch{return send(503,{error:'No se pudieron consultar las visitas'});}
 };
}
export default createHandler();
