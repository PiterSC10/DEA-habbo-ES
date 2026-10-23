import {list,put,head} from '@vercel/blob';
const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};
const respond=(res,status,data)=>{res.status(status);for(const [k,v] of Object.entries(headers))res.setHeader(k,v);res.end(JSON.stringify(data))};
async function count(prefix){let cursor,number=0;do{const page=await list({prefix,limit:1000,cursor});number+=page.blobs.length;cursor=page.hasMore?page.cursor:undefined}while(cursor);return number}
export default async function handler(req,res){
 if(req.method!=='GET'&&req.method!=='POST')return respond(res,405,{error:'Método no permitido'});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return respond(res,503,{error:'Contador no configurado'});
 const today=new Date().toISOString().slice(0,10);
 try{
  if(req.method==='POST'){
   const token=String(req.body?.visitor||'');
   if(!/^[a-f0-9]{32}$/.test(token))return respond(res,400,{error:'Identificador inválido'});
   const path='dea-visitas/v1/'+today+'/'+token+'.json';
   let exists=false;try{await head(path);exists=true}catch(e){if(e?.status!==404&&e?.statusCode!==404&&e?.name!=='BlobNotFoundError')throw e}
   if(!exists){try{await put(path,JSON.stringify({day:today}),{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'})}catch(e){if(e?.status!==409&&e?.statusCode!==409&&e?.name!=='BlobAlreadyExistsError')throw e}}
  }
  const [total,hoy]=await Promise.all([count('dea-visitas/v1/'),count('dea-visitas/v1/'+today+'/')]);
  return respond(res,200,{total,hoy,fecha:today,criterio:'Un navegador por día UTC'});
 }catch(e){console.error('DEA visits',e?.message||e);return respond(res,503,{error:'No se pudieron consultar las visitas'})}
}