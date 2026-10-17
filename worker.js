/** DEA HABBO ES · Worker API (Cloudflare Workers + D1, sin dependencias de servidor). */
const delayByCategory={R1:15*60_000,R2:2*3_600_000,R3:4*3_600_000,R4:12*3_600_000,R5:5*86_400_000,R6:15*86_400_000};
const rankCategories=[
 ['R1','Formación',['Cadete','Aspirante a Operador','Operador en práctica']],
 ['R2','Agentes',['Agente de Enlace','Agente Distinguido/a','Agente de Élite']],
 ['R3','Cuerpo Élite',['Instructor I','Instructor II','Instructor III','Instructor IV','Instructor V','Instructor VI','Instructor Advisor','Instructor en Jefe']],
 ['R4','Logística',['Estratega I','Estratega II','Estratega III','Estratega IV','Estratega V','Estratega en División']],
 ['R5','Supervisión',['Supervisor Estratega','Coordinador I','Coordinador II','Coordinador III','Coordinador IV','Coordinador V','Coordinador VI','Supervisor de Unidad']],
 ['R6','Dirección General',['Director de Cadetes','Director de Agentes','Director de Cuerpo Élite','Director de Logística','Director de Base','Director Advisor','Jefe de Dirección']]
];
export const RANKS=rankCategories.flatMap(([category,group,names])=>names.map(name=>({index:0,category,group,name}))).map((r,i)=>({...r,index:i}));
export function nextEligibility(agent,now=Date.now()){
 const rank=RANKS[agent?.rank_index];if(!rank)return {eligible:false,reason:'Rango sin estructura confirmada'};
 if(!RANKS[agent.rank_index+1])return {eligible:false,reason:'El siguiente rango está pendiente de definir'};
 const delay=delayByCategory[rank.category];const last=agent.last_promoted_at||agent.joined_at;
 const readyAt=Date.parse(last)+delay;
 if(!Number.isFinite(readyAt))return {eligible:false,reason:'Fecha de último ascenso no válida'};
 return {eligible:now>=readyAt,ready_at:new Date(readyAt).toISOString(),reason:now>=readyAt?'Plazo cumplido; falta comprobación presencial':'Plazo temporal pendiente'};
}
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers});}
function error(code,message,status){return json({ok:false,code,error:message},status)};
const now=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID();
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
async function sha(value){const out=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(out),b=>b.toString(16).padStart(2,'0')).join('')}
function cookie(req,key){const v=(req.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(key+'='));return v?decodeURIComponent(v.slice(key.length+1)):null}
function sessionCookie(value,age){return `__Host-dea_session=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`}
function stateCookie(value,age){return `dea_oauth_state=${encodeURIComponent(value)}; Path=/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`}
function safeIds(env){return new Set(String(env.FOUNDER_DISCORD_IDS||'').split(/[ ,;\n]+/).filter(x=>/^\d{15,25}$/.test(x)))}
async function current(req,env){
 const raw=cookie(req,'__Host-dea_session');if(!raw||!env.DB)return null;
 const hash=await sha(raw); const row=await env.DB.prepare(`SELECT s.discord_id,u.username,u.avatar_hash FROM sessions s JOIN users u ON s.discord_id=u.discord_id WHERE s.token_hash=? AND s.expires_at>?`).bind(hash,now()).first();
 if(!row)return null;
 const founder=safeIds(env).has(row.discord_id);
 const grant=founder?null:await env.DB.prepare('SELECT max_rank_index FROM promotion_permissions WHERE discord_id=?').bind(row.discord_id).first();
 const agent=await env.DB.prepare('SELECT * FROM agents WHERE discord_id=?').bind(row.discord_id).first();
 return {discord_id:row.discord_id,username:row.username,founder,max_rank_index:founder?RANKS.length-1:(grant?.max_rank_index??null),agent};
}
async function audit(env,actor,action,entityType,entityId,detail){return env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid(),actor,action,entityType,entityId,JSON.stringify(detail||{}),now()).run()}
async function parseJson(req){if(!String(req.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json'))throw Object.assign(new Error('Se requiere application/json'),{status:415});const s=await req.text();if(s.length>12_000)throw Object.assign(new Error('Solicitud demasiado grande'),{status:413});try{return JSON.parse(s)}catch{throw Object.assign(new Error('JSON inválido'),{status:400})}}
function needFounder(user){if(!user?.founder)throw Object.assign(new Error('Solo los Founders pueden realizar esta operación'),{status:403})}
function needManager(user){if(user?.max_rank_index===null || user?.max_rank_index===undefined)throw Object.assign(new Error('Sin permiso de ascensos'),{status:403})}
function originOk(req){const origin=req.headers.get('Origin');return !!origin&&origin===new URL(req.url).origin}
const plain=(s)=>String(s??'').trim();
function isDiscordId(id){return /^\d{15,25}$/.test(plain(id))}
function isHabboNick(n){return /^[A-Za-z0-9_.:\-]{2,32}$/.test(plain(n))}
function identity(u){return {discord_id:u.discord_id,username:u.username,founder:u.founder,can_promote:u.max_rank_index!==null,max_rank_index:u.max_rank_index,agent:u.agent?{...u.agent,eligibility:nextEligibility(u.agent)}:null}}
async function api(req,env,ctx,path){
 if(!env.DB)return error('db_missing','Falta configurar Cloudflare D1',503);
 if(path==='/api/health')return json({ok:true,api:'DEA V6',configured:!!env.DISCORD_CLIENT_ID&&!!env.DISCORD_CLIENT_SECRET,db:true});
 if(path==='/api/ranks')return json({ranks:RANKS,unconfirmed:['R7','R8','R9','R10']});
 const user=await current(req,env);
 if(path==='/api/session'&&req.method==='GET')return json({authenticated:!!user,user:user?identity(user):null,configured:!!env.DISCORD_CLIENT_ID});
 if(path==='/api/policies'&&req.method==='GET'){
  if(!user)return error('unauthorized','Debes iniciar sesión',401);
  needFounder(user);const d=await env.DB.prepare('SELECT * FROM rank_rules ORDER BY category').all();return json({policies:d.results||[]});
 }
 if(path==='/api/applications'&&req.method==='GET'){
  if(!user)return error('unauthorized','Debes iniciar sesión',401);
  needFounder(user);const d=await env.DB.prepare('SELECT a.*,u.username AS discord_username FROM applications a JOIN users u ON a.discord_id=u.discord_id ORDER BY a.created_at DESC LIMIT 500').all();return json({applications:d.results||[]});
 }
 if(path==='/api/payments'&&req.method==='GET'){
  if(!user)return error('unauthorized','Debes iniciar sesión',401);
  needFounder(user);const d=await env.DB.prepare('SELECT p.*,a.habbo_name FROM payments p JOIN agents a ON a.id=p.agent_id ORDER BY p.paid_at DESC LIMIT 500').all();return json({payments:d.results||[]});
 }
 if(path==='/api/payments/me'&&req.method==='GET'){
  if(!user)return error('unauthorized','Debes iniciar sesión',401);
  if(!user.agent)return json({payments:[]});const d=await env.DB.prepare('SELECT kind,payment_date,credits,paid_at FROM payments WHERE agent_id=? ORDER BY paid_at DESC LIMIT 100').bind(user.agent.id).all();return json({payments:d.results||[]});
 }

 if(!user)return error('unauthorized','Inicia sesión con Discord',401);
 if(path==='/api/members/me'&&req.method==='GET')return json({member:user.agent?{...user.agent,eligibility:nextEligibility(user.agent)}:null});
 if(path==='/api/members'&&req.method==='GET'){
  needManager(user);
  const result=await env.DB.prepare('SELECT id,habbo_name,discord_id,rank_index,joined_at,last_promoted_at FROM agents ORDER BY habbo_name COLLATE NOCASE LIMIT 500').all();
  return json({members:(result.results||[]).map(a=>({...a,eligibility:nextEligibility(a)})),total_in_page:result.results?.length||0,page_limit:500});
 }
 if(path==='/api/promotions'&&req.method==='GET'){
  const param=new URL(req.url).searchParams.get('agent_id');
  if(!user.founder&&user.max_rank_index===null&&!user.agent)return json({promotions:[]});
  if(!user.founder&&user.max_rank_index===null&&param&&param!==user.agent.id)throw Object.assign(new Error('No puedes consultar ese historial'),{status:403});
  let results;
  if(!user.founder&&user.max_rank_index===null){results=await env.DB.prepare('SELECT * FROM promotions WHERE agent_id=? ORDER BY promoted_at DESC LIMIT 100').bind(user.agent.id).all()}
  else if(param){results=await env.DB.prepare('SELECT * FROM promotions WHERE agent_id=? ORDER BY promoted_at DESC LIMIT 100').bind(param).all()}
  else{results=await env.DB.prepare('SELECT * FROM promotions ORDER BY promoted_at DESC LIMIT 100').all()}
  return json({promotions:results.results||[]});
 }
 if(path==='/api/audit'&&req.method==='GET'){
  needFounder(user);const r=await env.DB.prepare('SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 100').all();return json({events:r.results||[]});
 }
 if(path==='/api/export'&&req.method==='GET'){
  needFounder(user);
  const [members,promotions,auditEvents,permissions,applications,policies,payments,extraSessions]=await Promise.all([
   env.DB.prepare('SELECT * FROM agents ORDER BY habbo_name LIMIT 10000').all(),
   env.DB.prepare('SELECT * FROM promotions ORDER BY promoted_at LIMIT 20000').all(),
   env.DB.prepare('SELECT * FROM audit_events ORDER BY created_at LIMIT 20000').all(),
   env.DB.prepare('SELECT * FROM promotion_permissions LIMIT 1000').all(),
   env.DB.prepare('SELECT * FROM applications LIMIT 10000').all(),
   env.DB.prepare('SELECT * FROM rank_rules ORDER BY category').all(),
   env.DB.prepare('SELECT * FROM payments ORDER BY paid_at DESC LIMIT 20000').all(),
   env.DB.prepare('SELECT * FROM extra_sessions ORDER BY payment_date DESC LIMIT 5000').all()
  ]);
  const contents=JSON.stringify({generated_at:now(),version:6,limits:{agents:10000,promotions:20000,audit_events:20000,permissions:1000,applications:10000,payments:20000,extra_sessions:5000},agents:members.results,promotions:promotions.results,audit_events:auditEvents.results,permissions:permissions.results,applications:applications.results,policies:policies.results,payments:payments.results,extra_sessions:extraSessions.results},null,2);
  return new Response(contents,{headers:{...headers,'Content-Disposition':`attachment; filename="dea-backup-${new Date().toISOString().slice(0,10)}.json"`}});
 }
 if(path==='/api/permissions'&&req.method==='GET'){
  needFounder(user);const r=await env.DB.prepare('SELECT p.discord_id,p.max_rank_index,p.granted_by_discord_id,p.created_at,u.username FROM promotion_permissions p LEFT JOIN users u ON p.discord_id=u.discord_id ORDER BY p.created_at DESC LIMIT 100').all();return json({permissions:r.results||[]});
 }
 if(req.method!=='POST')return error('not_found','Ruta API desconocida',404);
 if(!originOk(req))return error('csrf','Origen de la solicitud no autorizado',403);
 if(path==='/api/logout'){
  const raw=cookie(req,'__Host-dea_session');if(raw)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(raw)).run();
  const out=json({ok:true});out.headers.append('Set-Cookie',sessionCookie('',0));return out;
 }
 const body=await parseJson(req);
 if(path==='/api/applications'){
  if(user.agent)return error('member_exists','Ya tienes un expediente activo',409);
  const name=plain(body.habbo_name);if(!isHabboNick(name))return error('validation','El nickname de Habbo es inválido',400);
  const existing=await env.DB.prepare('SELECT id FROM agents WHERE habbo_key=? OR discord_id=?').bind(name.toLowerCase(),user.discord_id).first();
  if(existing)return error('duplicate','Ese personaje o Discord ya tiene expediente',409);
  const old=await env.DB.prepare('SELECT status FROM applications WHERE discord_id=?').bind(user.discord_id).first();
  if(old)return error('duplicate','Ya existe una solicitud de esta cuenta Discord',409);
  const id=uid(),at=now();try{await env.DB.prepare('INSERT INTO applications(id,discord_id,habbo_name,habbo_key,status,created_at) VALUES (?,?,?,?,?,?)').bind(id,user.discord_id,name,name.toLowerCase(),'pendiente',at).run()}
  catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','Ya existe una solicitud con ese nombre o cuenta',409);throw e}
  return json({ok:true,application_id:id,status:'pendiente'},201);
 }
 const review=path.match(/^\/api\/applications\/([a-f0-9-]{36})\/(approve|reject)$/);
 if(review){
  needFounder(user);const row=await env.DB.prepare('SELECT * FROM applications WHERE id=?').bind(review[1]).first();
  if(!row)return error('missing','Solicitud no encontrada',404);if(row.status!=='pendiente')return error('conflict','La solicitud ya ha sido revisada',409);
  const at=now(),aid=uid();const approve=review[2]==='approve';
  if(approve){
   if(body.habbo_verified!==true)return error('verification','Confirma el R2 y la identidad Habbo en la sala',400);
   const known=await env.DB.prepare('SELECT id FROM agents WHERE habbo_key=? OR discord_id=?').bind(row.habbo_key,row.discord_id).first();if(known)return error('duplicate','Ese Habbo o Discord ya consta como agente',409);
   try{const results=await env.DB.batch([
    env.DB.prepare("UPDATE applications SET status='aprobada',reviewed_by=?,reviewed_at=? WHERE id=? AND status='pendiente'").bind(user.discord_id,at,row.id),
    env.DB.prepare('INSERT INTO agents(id,habbo_name,habbo_key,discord_id,rank_index,joined_at,last_promoted_at,created_by_discord_id) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM applications WHERE id=? AND status="aprobada")').bind(aid,row.habbo_name,row.habbo_key,row.discord_id,3,at,at,user.discord_id,row.id),
    env.DB.prepare('INSERT INTO audit_events(id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM agents WHERE id=?)').bind(uid(),user.discord_id,'application.approve','agent',aid,JSON.stringify({habbo_name:row.habbo_name,rank:'R2 · Agente de Enlace'}),at,aid)
   ]);if(!results[0]?.meta?.changes||!results[1]?.meta?.changes)return error('conflict','Solicitud revisada por otro Founder',409)}
   catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','El expediente ya existe o está vinculado',409);throw e}
  }else{
   const reason=plain(body.reason).slice(0,250);
   await env.DB.batch([
    env.DB.prepare("UPDATE applications SET status='rechazada',reviewed_by=?,reviewed_at=?,rejection_note=? WHERE id=? AND status='pendiente'").bind(user.discord_id,at,reason,row.id),
    env.DB.prepare('INSERT INTO audit_events(id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'application.reject','application',row.id,JSON.stringify({habbo_name:row.habbo_name,reason}),at)
   ]);
  }
  return json({ok:true,status:approve?'aprobada':'rechazada'});
 }
 const policy=path.match(/^\/api\/policies\/(R(?:10|[1-9]))$/);
 if(policy){
  needFounder(user);const cat=policy[1];const orig=await env.DB.prepare('SELECT * FROM rank_rules WHERE category=?').bind(cat).first();if(!orig)return error('missing','Categoría desconocida',404);
  const period=plain(body.period_label),h=body.payroll_hours===null?null:Number(body.payroll_hours),c=body.payroll_credits===null?null:Number(body.payroll_credits);
  if(!period||period.length>80||(h!==null&&(!Number.isFinite(h)||h<0||h>1000))||(c!==null&&(!Number.isInteger(c)||c<0||c>100000)))return error('validation','Parámetros fuera de rango',400);
  const m=period.toLowerCase().match(/^(?:cada\s+)?(\d+)\s*(minutos?|horas?|d[ií]as?)$/);const secs=m?Number(m[1])*(m[2].startsWith('min')?60:m[2].startsWith('hora')?3600:86400):null;
  const at=now();await env.DB.batch([
   env.DB.prepare('UPDATE rank_rules SET period_label=?,min_seconds=?,payroll_hours=?,payroll_credits=?,updated_by=?,updated_at=? WHERE category=?').bind(period,secs,h,c,user.discord_id,at,cat),
   env.DB.prepare('INSERT INTO audit_events(id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'policy.update','rank_rule',cat,JSON.stringify({before:orig,after:{period_label:period,min_seconds:secs,payroll_hours:h,payroll_credits:c}}),at)
  ]);return json({ok:true});
 }
 if(path==='/api/payments'){
  needFounder(user);const agent=await env.DB.prepare('SELECT * FROM agents WHERE id=?').bind(plain(body.agent_id)).first();if(!agent)return error('missing','Agente no encontrado',404);
  const kind=plain(body.kind),d=plain(body.payment_date),h=Number(body.hours_verified);
  if(!['miercoles','domingo'].includes(kind)||!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(h)||h<0||h>1000)return error('validation','Datos de nómina inválidos',400);
  const wk=new Date(d+'T12:00:00Z').getUTCDay();if((kind==='miercoles'&&wk!==3)||(kind==='domingo'&&wk!==0))return error('weekday','La jornada no corresponde al día seleccionado',400);
  const cat=RANKS[agent.rank_index]?.category||'R2';const rule=await env.DB.prepare('SELECT * FROM rank_rules WHERE category=?').bind(cat).first();
  if(rule?.payroll_hours===null||rule?.payroll_credits===null)return error('rule','La nómina de esta categoría no está definida',409);
  if(h<rule.payroll_hours)return error('hours','No se han verificado las horas mínimas',409);
  const id=uid(),at=now(),note=plain(body.note).slice(0,200);
  try{await env.DB.batch([
   env.DB.prepare('INSERT INTO payments(id,agent_id,kind,payment_date,hours_verified,credits,verified_by_discord_id,paid_at,note) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,agent.id,kind,d,h,rule.payroll_credits,user.discord_id,at,note),
   env.DB.prepare('INSERT INTO audit_events(id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'payroll.paid','payment',id,JSON.stringify({habbo_name:agent.habbo_name,kind,d,credits:rule.payroll_credits,hours:h}),at)
  ])}catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','Esta jornada ya tiene un pago para este agente',409);throw e}
  return json({ok:true,payment_id:id,credits:rule.payroll_credits});
 }
 if(path==='/api/extra-sessions'){
  needFounder(user);const d=plain(body.payment_date),amount=Number(body.credits_per_agent),ids=body.agent_ids;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||new Date(d+'T12:00:00Z').getUTCDay()!==6||!Number.isInteger(amount)||amount<0||amount>100000||!Array.isArray(ids)||!ids.length||ids.length>500||new Set(ids).size!==ids.length)return error('validation','Extra: fecha de sábado, cantidad y asistentes válidos obligatorios',400);
  const existing=await env.DB.prepare('SELECT payment_date FROM extra_sessions WHERE payment_date=?').bind(d).first();if(existing)return error('duplicate','La jornada del sábado ya ha sido registrada',409);
  const agents=(await env.DB.prepare('SELECT id,habbo_name FROM agents WHERE id IN ('+ids.map(()=>'?').join(',')+')').bind(...ids).all()).results||[];if(agents.length!==ids.length)return error('validation','Uno de los agentes no existe',400);
  const note=plain(body.note).slice(0,200),at=now(),sid=uid();const statements=[
   env.DB.prepare('INSERT INTO extra_sessions(payment_date,credits_per_agent,created_by_discord_id,created_at,note) VALUES(?,?,?,?,?)').bind(d,amount,user.discord_id,at,note),
   ...agents.map(a=>env.DB.prepare("INSERT INTO payments(id,agent_id,kind,payment_date,hours_verified,credits,verified_by_discord_id,paid_at,note) VALUES(?,?,'extra',?,NULL,?,?,?,?)").bind(uid(),a.id,d,amount,user.discord_id,at,note)),
   env.DB.prepare('INSERT INTO audit_events(id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'extra.paid','extra_session',d,JSON.stringify({amount,agent_names:agents.map(a=>a.habbo_name),total:amount*agents.length}),at)
  ];try{await env.DB.batch(statements)}catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','Existe una extra registrada para esa fecha',409);throw e}
  return json({ok:true,credits_per_agent:amount,count:agents.length});
 }
 if(path==='/api/members'){
  needFounder(user);const name=plain(body.habbo_name);if(!isHabboNick(name))return error('validation','Nickname Habbo inválido (2–32 caracteres; sin espacios)',400);
  const id=uid(),date=now();
  try{await env.DB.batch([
   env.DB.prepare('INSERT INTO agents (id,habbo_name,habbo_key,rank_index,joined_at,last_promoted_at,created_by_discord_id) VALUES (?,?,?,?,?,?,?)').bind(id,name,name.toLowerCase(),3,date,date,user.discord_id),
   env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'member.create','agent',id,JSON.stringify({habbo_name:name}),date)
  ])}catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','Ya existe un agente con ese nickname',409);throw e}
  return json({ok:true,id,habbo_name:name},201);
 }
 const link=path.match(/^\/api\/members\/([a-f0-9-]{36})\/link$/);
 if(link){
  needFounder(user);const discordId=plain(body.discord_id);if(!isDiscordId(discordId))return error('validation','Se necesita el ID numérico de Discord, no el nombre',400);
  const member=await env.DB.prepare('SELECT id,habbo_name FROM agents WHERE id=?').bind(link[1]).first();if(!member)return error('missing','Agente no encontrado',404);
  const existing=await env.DB.prepare('SELECT discord_id FROM users WHERE discord_id=?').bind(discordId).first();if(!existing)return error('not_registered','Esa cuenta debe iniciar sesión con Discord al menos una vez antes de vincularla',409);
  try{await env.DB.batch([
   env.DB.prepare('UPDATE agents SET discord_id=? WHERE id=?').bind(discordId,member.id),
   env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'member.link','agent',member.id,JSON.stringify({discord_id:discordId}),now())
  ])}catch(e){if(/UNIQUE|constraint/i.test(String(e)))return error('duplicate','Esa cuenta Discord ya está vinculada a otro agente',409);throw e}
  return json({ok:true});
 }
 const promote=path.match(/^\/api\/members\/([a-f0-9-]{36})\/promotions$/);
 if(promote){
  needManager(user);
  if(body.presence_verified!==true)return error('presence','Confirma presencialmente el ascenso en Habbo antes de registrarlo',400);
  const member=await env.DB.prepare('SELECT * FROM agents WHERE id=?').bind(promote[1]).first();if(!member)return error('missing','Agente no encontrado',404);
  const to=member.rank_index+1;
  if(body.to_rank_index!==to||!RANKS[to])return error('rank','Solo se permite el siguiente rango interno confirmado',400);
  if(to>user.max_rank_index)return error('permission','No tienes autorización para ascender a este rango',403);
  if(member.discord_id===user.discord_id)return error('self','No se permiten autoascensos',403);
  const rawEligibility=nextEligibility(member);
  const sourceCat=RANKS[member.rank_index]?.category;
  const currentRule=await env.DB.prepare('SELECT min_seconds FROM rank_rules WHERE category=?').bind(sourceCat).first();
  const readyAt=currentRule?.min_seconds===null?null:new Date(Date.parse(member.last_promoted_at||member.joined_at)+Number(currentRule.min_seconds)*1000).toISOString();
  const eligibility=readyAt?{eligible:Date.now()>=Date.parse(readyAt),ready_at:readyAt,reason:'Plazo conforme a normativa'}:rawEligibility;
  if(currentRule&&currentRule.min_seconds===null)return error('manual_rule','Ascenso por méritos o decisión de Founders: necesita procedimiento especial',409);
  if(!eligibility.eligible)return error('too_early',`Ascenso todavía no disponible. ${eligibility.reason}. Disponible desde ${eligibility.ready_at||'fecha pendiente'}`,409);
  const note=plain(body.note);if(note.length>500)return error('validation','La observación supera 500 caracteres',400);
  const date=now(),pid=uid();
  const statements=[
   env.DB.prepare('UPDATE agents SET rank_index=?,last_promoted_at=? WHERE id=? AND rank_index=? AND last_promoted_at=? AND last_promoted_at<=?').bind(to,date,member.id,member.rank_index,member.last_promoted_at,eligibility.ready_at),
   env.DB.prepare('INSERT INTO promotions (id,agent_id,from_rank_index,to_rank_index,authorized_by_discord_id,presence_verified,note,promoted_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM agents WHERE id=? AND rank_index=? AND last_promoted_at=?)').bind(pid,member.id,member.rank_index,to,user.discord_id,1,note,date,member.id,to,date),
   env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM promotions WHERE id=?)').bind(uid(),user.discord_id,'promotion.create','promotion',pid,JSON.stringify({agent_id:member.id,from:member.rank_index,to,habbo_name:member.habbo_name}),date,pid)
  ];
  const batch=await env.DB.batch(statements);
  if(!batch[0]?.meta?.changes||!batch[1]?.meta?.changes)return error('conflict','Ascenso no registrado: el expediente cambió. Actualiza y revisa.',409);
  if(env.DISCORD_ASCENSOS_WEBHOOK&&ctx?.waitUntil){ctx.waitUntil(sendDiscord(env,{member,by:user,rank:RANKS[to],date,pid}).catch(()=>{}))}
  return json({ok:true,promotion_id:pid,rank:RANKS[to],promoted_at:date});
 }
 if(path==='/api/permissions/revoke'){
  needFounder(user);const target=plain(body.discord_id);if(!isDiscordId(target))return error('validation','Discord ID incorrecto',400);
  const existing=await env.DB.prepare('SELECT discord_id FROM promotion_permissions WHERE discord_id=?').bind(target).first();if(!existing)return error('missing','No existe un permiso delegado para esa cuenta',404);
  await env.DB.batch([
   env.DB.prepare('DELETE FROM promotion_permissions WHERE discord_id=?').bind(target),
   env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'permission.revoke','user',target,'{}',now())
  ]);return json({ok:true});
 }
 if(path==='/api/permissions'){
  needFounder(user);
  const target=plain(body.discord_id);const max=Number(body.max_rank_index);
  if(!isDiscordId(target)||!Number.isInteger(max)||max<0||max>=RANKS.length)return error('validation','Discord ID o nivel autorizado incorrectos',400);
  if(safeIds(env).has(target))return error('founder','Los Founders no necesitan delegación',400);
  const exists=await env.DB.prepare('SELECT discord_id FROM agents WHERE discord_id=?').bind(target).first();if(!exists)return error('missing','Solo se puede delegar a un agente vinculado a Discord',409);
  await env.DB.batch([
   env.DB.prepare('INSERT INTO promotion_permissions (discord_id,max_rank_index,granted_by_discord_id,created_at) VALUES (?,?,?,?) ON CONFLICT(discord_id) DO UPDATE SET max_rank_index=excluded.max_rank_index,granted_by_discord_id=excluded.granted_by_discord_id,created_at=excluded.created_at').bind(target,max,user.discord_id,now()),
   env.DB.prepare('INSERT INTO audit_events (id,actor_discord_id,action,entity_type,entity_id,detail_json,created_at) VALUES (?,?,?,?,?,?,?)').bind(uid(),user.discord_id,'permission.grant','user',target,JSON.stringify({max_rank_index:max}),now())
  ]);
  return json({ok:true});
 }
 return error('not_found','Ruta API desconocida',404);
}
async function sendDiscord(env,{member,by,rank,date,pid}){
 const url=String(env.DISCORD_ASCENSOS_WEBHOOK||'');if(!/^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//.test(url))return;
 const payload={username:'DEA · Ascensos',allowed_mentions:{parse:[]},embeds:[{title:'ASCENSO REGISTRADO',color:13940596,fields:[{name:'Agente',value:member.habbo_name,inline:true},{name:'Nuevo rango',value:`${rank.category} · ${rank.name}`,inline:true},{name:'Autorizado por',value:by.username,inline:true}],footer:{text:`DEA · ${pid.slice(0,8)}`},timestamp:date}]};
 await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
}
async function oauth(req,env,path){
 if(!env.DB||!env.DISCORD_CLIENT_ID||!env.DISCORD_CLIENT_SECRET)return error('configuration','Configura D1 y Discord OAuth antes de iniciar sesión',503);
 const url=new URL(req.url),redirect=url.origin+'/auth/callback';
 if(path==='/auth/login'){
  const state=token();const oauthUrl=new URL('https://discord.com/oauth2/authorize');
  for(const [k,v] of Object.entries({client_id:String(env.DISCORD_CLIENT_ID),redirect_uri:redirect,response_type:'code',scope:'identify',state,prompt:'consent'}))oauthUrl.searchParams.set(k,v);
  return new Response(null,{status:302,headers:{Location:oauthUrl.toString(),'Set-Cookie':stateCookie(state,600),'Cache-Control':'no-store'}});
 }
 if(path==='/auth/callback'){
  const expected=cookie(req,'dea_oauth_state');const state=url.searchParams.get('state');const code=url.searchParams.get('code');
  if(!expected||!state||state!==expected||!code)return error('oauth','Validación OAuth fallida. Reinicia el acceso.',403);
  const data=new URLSearchParams({client_id:String(env.DISCORD_CLIENT_ID),client_secret:String(env.DISCORD_CLIENT_SECRET),grant_type:'authorization_code',code,redirect_uri:redirect});
  const exchange=await fetch('https://discord.com/api/v10/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data});
  if(!exchange.ok)return error('oauth','Discord rechazó el intercambio del código',502);
  const tokens=await exchange.json();
  const identityResponse=await fetch('https://discord.com/api/v10/users/@me',{headers:{Authorization:'Bearer '+tokens.access_token}});
  if(!identityResponse.ok)return error('oauth','No se pudo obtener tu identidad de Discord',502);
  const who=await identityResponse.json();if(!isDiscordId(who.id))return error('oauth','Discord devolvió un ID inválido',502);
  await env.DB.prepare('INSERT INTO users (discord_id,username,avatar_hash,updated_at) VALUES (?,?,?,?) ON CONFLICT(discord_id) DO UPDATE SET username=excluded.username,avatar_hash=excluded.avatar_hash,updated_at=excluded.updated_at').bind(who.id,String(who.global_name||who.username||'Agente').slice(0,80),who.avatar||null,now()).run();
  const raw=token();await env.DB.prepare('INSERT INTO sessions (token_hash,discord_id,created_at,expires_at) VALUES (?,?,?,?)').bind(await sha(raw),who.id,now(),new Date(Date.now()+7*86_400_000).toISOString()).run();
  const out=new Response(null,{status:302,headers:{Location:safeIds(env).has(who.id)?'/#/vip':'/#/unete','Cache-Control':'no-store'}});
  out.headers.append('Set-Cookie',sessionCookie(raw,604800));out.headers.append('Set-Cookie',stateCookie('',0));return out;
 }
 return error('not_found','Ruta desconocida',404);
}
export default {async fetch(req,env,ctx){
 const url=new URL(req.url),path=url.pathname;
 try{
  if(path.startsWith('/auth/'))return await oauth(req,env,path);
  if(path.startsWith('/api/'))return await api(req,env,ctx,path);
  if(!['GET','HEAD'].includes(req.method))return error('not_allowed','Método no permitido',405);
  if(!env.ASSETS)return error('assets_missing','Activos no configurados',503);
  const response=await env.ASSETS.fetch(req);
  if(req.method==='GET'&&response.ok&&(response.headers.get('content-type')||'').includes('text/html')){
   const html=(await response.text()).replaceAll('content="./og-image.jpg"',`content="${url.origin}/og-image.jpg"`);
   const h=new Headers(response.headers);h.delete('content-length');h.delete('etag');h.set('cache-control','public, max-age=300');return new Response(html,{status:response.status,headers:h});
  }
  return response;
 }catch(e){const code=e.status||500;if(code>=500)console.error('DEA API error',e);return error('request_failed',code>=500?'Error interno. Comprueba el servidor y la base de datos.':e.message,code)}
}};
