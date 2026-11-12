// Temporary read-only recovery endpoint. Returns aggregate counts only; never visit IDs or credentials.
import {get,list} from '@vercel/blob';
const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.status(405).json({error:'Solo lectura'});return;}
 let baseline,readError='';
 try{
  const file=await get('dea-visitas/v3/contador.json',{access:'private'});
  if(file){const state=await new Response(file.stream).json();if(state.version!==3||!Number.isSafeInteger(state.total)||state.total<0||!state.days||Object.entries(state.days).some(([d,n])=>!dayPattern.test(d)||!Number.isSafeInteger(n)||n<0))throw Error('InvalidCount');baseline={total:state.total,days:state.days};}
 }catch(e){readError=e?.constructor?.name||'StorageError';}
 const versions={};let listError='';
 try{for(const version of ['v1','v2','v4']){let cursor;const days={};do{const page=await list({prefix:'dea-visitas/'+version+'/',limit:1000,...(cursor?{cursor}:{})});for(const b of page.blobs){const d=b.pathname.match(/\/(\d{4}-\d{2}-\d{2})\//)?.[1];if(d)days[d]=(days[d]||0)+1;}cursor=page.hasMore?page.cursor:undefined;}while(cursor);versions[version]=days;}}
 catch(e){listError=e?.constructor?.name||'StorageError';}
 if(!baseline||listError){res.status(200).json({recuperado:false,lecturaHistorico:baseline?'disponible':readError||'no encontrado',listado:listError||'disponible',diariosPorVersion:versions});return;}
 const days={...baseline.days};let added=0;for(const [d,n] of Object.entries(versions.v4||{})){days[d]=(days[d]||0)+n;added+=n;}
 res.status(200).json({recuperado:true,total:baseline.total+added,diarios:days,origen:'Vercel Blob v3 + v4',historialAntiguoConservado:true});
}
