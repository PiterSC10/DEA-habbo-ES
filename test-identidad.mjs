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
 const context={deaTab_:n=>sheets[n],deaRows_:sh=>{const latest=new Map();sh.getDataRange().getDisplayValues().slice(1).forEach(row=>latest.set(row[0],{row}));return [...latest.values()];},deaRequire_:(token,founder)=>{const me=users[token];if(!me||founder&&!me.founder)throw Error('Discord requerido');return me;},deaWithLock_:fn=>{assert.equal(locked,false);locked=true;try{return fn();}finally{locked=false;}},deaRankCatalog_:()=>ranks,deaNick_:v=>v,deaClean_:v=>v,deaText_:v=>{if(!v)throw Error('Motivo');return v;},deaId_:()=>String(++seq),deaNow_:()=>new Date().toISOString(),deaIsMaster_:me=>me.id===users.master.id,deaAudit_:(...r)=>db.AUDITORIA.push(r),deaSnapshot_:(name,r)=>sheets[name].appendRow(r),deaNext_:rank=>ranks[ranks.findIndex(r=>r.rango===rank)+1]||null,SpreadsheetApp:{flush(){}},Utilities:{base64Decode:s=>[...Buffer.from(s,'base64')]}};
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
 assert.throws(()=>api.deaResolverSolicitud('boss',id,'aprobar',false,'Verificado'),/presencialmente/);
 api.deaResolverSolicitud('boss',id,'aprobar',true,'Verificado');assert.equal(db.AGENTES.at(-1)[6],'Supervisor');assert.equal(db.AGENTES.at(-1)[8],'Delegado');
 assert.equal(db.SOLICITUDES.length,3);assert.equal(db.SOLICITUDES[1][6],'Pendiente');assert.equal(db.SOLICITUDES[2][6],'Aprobada');
 assert.throws(()=>api.deaResolverSolicitud('boss',id,'aprobar',true,'Verificado'),/no pendiente/);
});
test('Rangos superiores requieren Master y no se autoaprueban',()=>{
 const {api,db,users}=fixture();api.deaRegistrarIdentidad('a','Uno','ABC','','');api.deaSolicitarAlta('a','Uno','R7:Delegado');const id=db.SOLICITUDES.at(-1)[0];
 assert.throws(()=>api.deaResolverSolicitud('boss',id,'aprobar',true,'Verificado'),/Master/);
 api.deaResolverSolicitud('master',id,'aprobar',true,'Verificado');assert.equal(db.AGENTES.at(-1)[5],'R7');
 assert.equal(db.AUDITORIA.at(-1)[5].id,users.master.id);
 db.SOLICITUDES.push(['self','fecha',users.boss.id,'','Jefe','Pendiente','Pendiente','','','','R2','Agente de Enlace']);
 assert.throws(()=>api.deaResolverSolicitud('boss','self','aprobar',true,'Verificado'),/propia/);
});
test('No se sobrescribe un expediente previo incompatible',()=>{
 const {api,db,users}=fixture();db.AGENTES.push(['f','fecha',users.a.id,'','OtroHabbo']);
 assert.throws(()=>api.deaRegistrarIdentidad('a','Uno','ABC','',''),/no coincide/);assert.equal(db.IDENTIDADES_DEA.length,1);
});

test('10P solo puede elegirla el propietario autenticado y no se asigna al consultar',()=>{const {api,db}=fixture();assert.equal(db.IDENTIDADES_DEA.length,1);api.deaRegistrarIdentidad('master','Propietario','10P','','');assert.equal(db.IDENTIDADES_DEA.at(-1)[2],'10P');});
