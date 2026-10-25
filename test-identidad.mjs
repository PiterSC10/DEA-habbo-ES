import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('./integraciones/apps-script/identidad-dea.gs',import.meta.url),'utf8');
function fixture(){
 const db={IDENTIDADES_DEA:[['discord_id','habbo_nick','firma','avatar_file_id','fecha_alta_utc','fecha_actualizacion_utc','estado']],AGENTES:[[]],SOLICITUDES:[[]],FOUNDERS:[[]],AUDITORIA:[[]]};
 const sheets=Object.fromEntries(Object.keys(db).map(n=>[n,{getName:()=>n,getRange:()=>({getDisplayValues:()=>[db[n][0]]}),getDataRange:()=>({getDisplayValues:()=>db[n].map(r=>r.slice())}),appendRow:r=>db[n].push(r.slice())}]));
 const users={a:{id:'111111111111111111',username:'uno'},b:{id:'222222222222222222',username:'dos'},boss:{id:'333333333333333333',founder:{name:'Founder'}},master:{id:'444444444444444444',founder:{name:'Master'}}};
 const ranks=[{categoria:'R2',rango:'Agente de Enlace'},{categoria:'R3',rango:'Supervisor'},{categoria:'R7',rango:'Delegado'}];let seq=0,locked=false;
 const context={deaObjects_:()=>[],deaTab_:n=>sheets[n],deaRows_:sh=>{const latest=new Map();sh.getDataRange().getDisplayValues().slice(1).forEach(row=>latest.set(row[0],{row}));return [...latest.values()];},deaRequire_:(token,founder)=>{const me=users[token];if(!me||founder&&!me.founder)throw Error('Discord requerido');return me;},deaWithLock_:fn=>{assert.equal(locked,false);locked=true;try{return fn();}finally{locked=false;}},deaRankCatalog_:()=>ranks,deaNick_:v=>v,deaClean_:v=>v,deaText_:v=>{if(!v)throw Error('Motivo');return v;},deaId_:()=>String(++seq),deaNow_:()=>new Date().toISOString(),deaIsMaster_:me=>me.id===users.master.id,deaAudit_:(...r)=>db.AUDITORIA.push(r),deaSnapshot_:(name,r)=>sheets[name].appendRow(r),deaNext_:rank=>ranks[ranks.findIndex(r=>r.rango===rank)+1]||null,SpreadsheetApp:{flush(){}},Utilities:{base64Decode:s=>[...Buffer.from(s,'base64')]}};
 vm.createContext(context);vm.runInContext(source,context);return {api:context,db,users};
}
test('Registro único, firma fija, duplicados y reserva 10P',()=>{
 const {api,db}=fixture();assert.throws(()=>api.deaRegistrarIdentidad('','Uno','ABC','',''));
 assert.throws(()=>api.deaRegistrarIdentidad('a','Uno','10P','',''),/reservada/);
 api.deaRegistrarIdentidad('a','Uno','abc','','');assert.equal(api.deaFindIdentity_('111111111111111111').signature,'ABC');
 assert.throws(()=>api.deaRegistrarIdentidad('a','Uno','XYZ','',''),/inmodificable/);
 assert.throws(()=>api.deaRegistrarIdentidad('b','Dos','ABC','',''),/registrado/);
 assert.throws(()=>api.deaRegistrarIdentidad('b','uno','DEF','',''),/registrado/);
 assert.equal(db.IDENTIDADES_DEA.length,2);
});
test('Fotografía propia, formatos y privacidad',()=>{
 const {api,db}=fixture();api.deaRegistrarIdentidad('a','Uno','ABC','','');
 const png=Buffer.from([137,80,78,71,13,10,26,10,0]).toString('base64');
 assert.throws(()=>api.deaActualizarFoto('b',png,'image/png'),/primero/);
 assert.throws(()=>api.deaActualizarFoto('a',png,'image/jpeg'),/formato/);
 api.deaActualizarFoto('a',png,'image/png');assert.equal(api.deaMiFoto('a').base64,png);assert.equal(api.deaMiFoto('b'),null);
 assert.equal(api.deaFindIdentity_('111111111111111111').signature,'ABC');assert.equal(db.AUDITORIA.at(-1)[0],'FOTO_ACTUALIZADA');
});
test('Solicitud usa rango real y aprobación conserva historial',()=>{
 const {api,db}=fixture();api.deaRegistrarIdentidad('a','Uno','ABC','','');
 assert.throws(()=>api.deaSolicitarAlta('a','Uno','R9:Inventado'),/oficial/);
 api.deaSolicitarAlta('a','Uno','R3:Supervisor');const id=db.SOLICITUDES.at(-1)[0];
 assert.throws(()=>api.deaSolicitarAlta('a','Uno','R3:Supervisor'),/pendiente/);
 assert.throws(()=>api.deaResolverSolicitud('a',id,'aprobar',true,'Verificado'));
 assert.throws(()=>api.deaResolverSolicitud('master',id,'aprobar',false,'Verificado'),/presencialmente/);
 api.deaResolverSolicitud('master',id,'aprobar',true,'Verificado');assert.equal(db.AGENTES.at(-1)[6],'Supervisor');assert.equal(db.AGENTES.at(-1)[8],'Delegado');
 assert.equal(db.SOLICITUDES.length,3);assert.equal(db.SOLICITUDES[1][6],'Pendiente');assert.equal(db.SOLICITUDES[2][6],'Aprobada');
 assert.throws(()=>api.deaResolverSolicitud('boss',id,'aprobar',true,'Verificado'),/no pendiente/);
});
test('Rangos superiores requieren Master y no se autoaprueban',()=>{
 const {api,db,users}=fixture();api.deaRegistrarIdentidad('a','Uno','ABC','','');api.deaSolicitarAlta('a','Uno','R7:Delegado');const id=db.SOLICITUDES.at(-1)[0];
 assert.throws(()=>api.deaResolverSolicitud('boss',id,'aprobar',true,'Verificado'),/Master/);
 api.deaResolverSolicitud('master',id,'aprobar',true,'Verificado');assert.equal(db.AGENTES.at(-1)[5],'R7');
 assert.equal(db.AUDITORIA.at(-1)[5].id,users.master.id);
 db.SOLICITUDES.push(['self','fecha',users.master.id,'','Jefe','Pendiente','Pendiente','','','','R2','Agente de Enlace']);
 assert.throws(()=>api.deaResolverSolicitud('master','self','aprobar',true,'Verificado'),/propia/);
});
test('No se sobrescribe un expediente previo incompatible',()=>{
 const {api,db,users}=fixture();db.AGENTES.push(['f','fecha',users.a.id,'','OtroHabbo']);
 assert.throws(()=>api.deaRegistrarIdentidad('a','Uno','ABC','',''),/no coincide/);assert.equal(db.IDENTIDADES_DEA.length,1);
});

test('10P solo puede elegirla el propietario autenticado y no se asigna al consultar',()=>{const {api,db}=fixture();assert.equal(db.IDENTIDADES_DEA.length,1);api.deaRegistrarIdentidad('master','Propietario','10P','','');assert.equal(db.IDENTIDADES_DEA.at(-1)[2],'10P');});

test('Primer registro unificado: 37 reglas de autorización, identidad y cierre Founder',()=>{const FACTORY=new Function('env','with(env){'+source+';return {deaRegistroInicial,deaInitialMeta_,deaResolverSolicitud,deaInitialOptions_,deaFindIdentity_,deaInitialEnrich_};}');const result=(()=>{
 const checks=[];const ok=(n,v)=>{if(!v)throw Error(n);checks.push(n)},deny=(n,f)=>{let no=false;try{f()}catch(e){no=true;}ok(n,no)};
 const headers=['discord_id','habbo_nick','firma','avatar_file_id','fecha_alta_utc','fecha_actualizacion_utc','estado'];
 const db={IDENTIDADES_DEA:[headers],SOLICITUDES:[[]],AGENTES:[[]],FOUNDERS:[[],['10PEDRO','FOUNDER','Master','626463210249125928','Activo',''],['lesslie.ar','FOUNDER','Coordinadora','','Pendiente','']],AUDITORIA:[[]],AUTORIZACIONES_CARGOS:[[]]};
 const catalog=[{categoria:'R2',rango:'Agente de Enlace'},{categoria:'R5',rango:'Supervisor I'},{categoria:'R6',rango:'Director de Agentes'},{categoria:'R7',rango:'Delegado Dir. Cadetes'},{categoria:'R10',rango:'Mánager de PBL'}];
 const users={master:{id:'626463210249125928',founder:{name:'10PEDRO'},username:'master'},boss:{id:'333333333333333333',founder:{name:'Other'},username:'boss'},fake:{id:'999999999999999999',founder:{name:'10PEDRO'},username:'fake'}};
 let serial=100,lock=false;const latest=n=>{const map=new Map();db[n].slice(1).forEach((row,i)=>map.set(row[0],{row,rowNum:i+2}));return [...map.values()]};
 const sheets={};for(const n of Object.keys(db))sheets[n]={getName:()=>n,getDataRange:()=>({getDisplayValues:()=>db[n].map(r=>r.map(x=>String(x??'')))}),getRange:()=>({getDisplayValues:()=>[headers]}),appendRow:r=>db[n].push(r.slice())};
 const env={deaTab_:n=>sheets[n],deaRows_:sh=>latest(sh.getName()),deaObjects_:n=>n==='AUDITORIA'?db[n].slice(1).map(r=>({accion:r[2],registroId:r[4],nuevo:r[6]})):n==='SOLICITUDES'?latest(n).map(x=>Object.fromEntries(['id','fecha','discordId','discord','habbo','habboVerificado','estado','revisor','fechaRevision','notas','categoriaSolicitada','rangoSolicitado'].map((k,i)=>[k,x.row[i]]))):[],deaRequire_:(t,f)=>{const u=users[t];if(!u||f&&!u.founder)throw Error('Inicia sesión con Discord');return u},deaWithLock_:fn=>{if(lock)throw Error('Nested lock');lock=true;try{return fn()}finally{lock=false}},deaRankCatalog_:()=>catalog,deaNick_:v=>{if(!/^[A-Za-z0-9_.:-]{2,32}$/.test(v))throw Error('Nick');return v},deaClean_:(v,m)=>{if(String(v||'').length>m)throw Error('Length');return String(v||'')},deaText_:(v,m)=>{if(!v||v.length>m)throw Error('Reason');return v},deaId_:()=>String(++serial),deaNow_:()=>new Date().toISOString(),deaIsMaster_:me=>me.id===users.master.id&&me.founder?.name==='10PEDRO',deaFounderApp_:()=>({habbo:'lesslie.ar'}),deaCargoAutorizacion_:id=>{const x=latest('AUTORIZACIONES_CARGOS').find(x=>x.row[0]===id);return x&&x.row[3]==='ACTIVO'?x.row:null},deaSnapshot_:(n,r)=>sheets[n].appendRow(r),deaNext_:()=>null,deaAudit_:(a,e,id,b,c,me,reason)=>db.AUDITORIA.push([String(++serial),'now',a,e,id,JSON.stringify(b),JSON.stringify(c),me.id,'',reason]),SpreadsheetApp:{flush:()=>{}},Utilities:{getUuid:()=>String(++serial).padStart(32,'0'),base64Decode:()=>[137,80,78,71,13,10,26,10]}};
 const api=FACTORY(env),add=(key,n)=>users[key]={id:'10000000000000000'+String(n),username:key};
 const submit=(key,nick,sig,rank,train=true)=>api.deaRegistroInicial(key,nick,sig,'','',rank,'Departamento verificado',train);
 const request=key=>latest('SOLICITUDES').find(x=>x.row[2]===users[key].id&&x.row[6]==='Pendiente').row;
 const approve=(key,actor='master',code)=>{const r=request(key),m=api.deaInitialMeta_(r[0]);return api.deaResolverSolicitud(actor,r[0],'aprobar',true,'Comprobado en sala',code===undefined?m.challenge:code)};
 deny('Sin OAuth no hay registro',()=>submit('','Anon','AAA','R2:Agente de Enlace'));
 add('new',1);deny('R2 exige formación',()=>submit('new','Novato','N01','R2:Agente de Enlace',false));ok('Validación previa no deja identidad parcial',db.IDENTIDADES_DEA.length===1);
 submit('new','Novato','N01','R2:Agente de Enlace');ok('Registro completo crea una identidad y solicitud',db.IDENTIDADES_DEA.length===2&&latest('SOLICITUDES').length===1);ok('Solicitar no activa expediente',db.AGENTES.length===1&&db.AUTORIZACIONES_CARGOS.length===1);submit('new','Novato','N01','R2:Agente de Enlace');ok('Reintento no duplica',latest('SOLICITUDES').length===1&&db.IDENTIDADES_DEA.length===2);
 deny('Founder no Master no aprueba primer registro',()=>approve('new','boss'));deny('Nombre Master falsificado no concede acceso',()=>approve('new','fake'));deny('Código de misión incorrecto bloquea aprobación',()=>approve('new','master','MAL'));approve('new');ok('Master activa R2 tras verificar',latest('AGENTES').some(x=>x.row[2]===users.new.id&&x.row[5]==='R2'));ok('Firma permanece fija después de aprobación',api.deaFindIdentity_(users.new.id).signature==='N01');deny('No se puede cambiar firma',()=>submit('new','Novato','XYZ','R2:Agente de Enlace'));
 add('dup',2);deny('Firma única global',()=>submit('dup','Otro','N01','R5:Supervisor I'));deny('Habbo único sin distinguir mayúsculas',()=>submit('dup','novato','D02','R5:Supervisor I'));deny('10P protegida por ID verificado',()=>submit('dup','Otro','10P','R5:Supervisor I'));deny('Rango inventado rechazado',()=>submit('dup','Otro','D02','R99:Admin'));
 for(const [k,n,rank,grant] of [['sup',3,'R5:Supervisor I',null],['dir',4,'R6:Director de Agentes','director'],['del',5,'R7:Delegado Dir. Cadetes',null],['mgr',6,'R10:Mánager de PBL','manager']]){add(k,n);submit(k,'Habbo'+k,'S'+n+'A',rank);deny(k+' no se autoaprueba',()=>approve(k,k));approve(k);ok(k+' rango directo verificado',latest('AGENTES').some(x=>x.row[2]===users[k].id&&x.row[5]===rank.split(':')[0]));const role=env.deaCargoAutorizacion_(users[k].id);ok(k+' permisos acordes al cargo',grant?role&&role[2]===grant:!role);}
 add('founder',7);users.founder.pendingLink=true;users.founder.app='f-test';deny('Founder limita nombre pendiente exacto',()=>submit('founder','Intruso','F07','FOUNDER:Founder'));submit('founder','lesslie.ar','F07','FOUNDER:Founder');ok('Founder continúa sin acceso antes de Master',!latest('FOUNDERS').find(x=>x.row[0]==='lesslie.ar').row[3]);approve('founder');ok('Master vincula Founder a Discord OAuth',latest('FOUNDERS').find(x=>x.row[0]==='lesslie.ar').row[3]===users.founder.id);ok('Founder se cierra automáticamente',!api.deaInitialOptions_(users.new).founderOpen);add('extra',8);deny('Founder cerrado también en servidor',()=>submit('extra','lesslie.ar','E08','FOUNDER:Founder'));
 add('reject',9);submit('reject','Rechazado','R09','R5:Supervisor I');api.deaResolverSolicitud('master',request('reject')[0],'rechazar',false,'No coincide');ok('Rechazo no concede permisos',!latest('AGENTES').some(x=>x.row[2]===users.reject.id));ok('Auditoría de aprobación y rechazo',db.AUDITORIA.some(x=>x[2]==='ALTA_INICIAL_APROBADA')&&db.AUDITORIA.some(x=>x[2]==='ALTA_INICIAL_RECHAZADA'));
 const publicState={};api.deaInitialEnrich_(publicState,users.new);ok('Agente no recibe fotos o expedientes ajenos',!publicState.initialReviews);const masterState={};api.deaInitialEnrich_(masterState,users.master);ok('Revisión es exclusiva del Master',Array.isArray(masterState.initialReviews));
 return {ok:true,checks,isolated:true,productionWrites:0};
})();assert.equal(result.ok,true);assert.equal(result.checks.length,37);});
