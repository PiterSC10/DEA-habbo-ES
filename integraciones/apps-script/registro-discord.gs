/** DEA 6.20261112. Called only after /users/@me verification, inside the OAuth lock. */
const DEA_REGISTRY_HEADERS_=['discord_id','discord_usuario','fecha_alta_utc','origen'];
function deaRegistryTab_(){const ss=deaBook_();let sh=ss.getSheetByName('REGISTROS_DISCORD');if(!sh){sh=ss.insertSheet('REGISTROS_DISCORD');sh.appendRow(DEA_REGISTRY_HEADERS_);sh.setFrozenRows(1);sh.getRange('A:A').setNumberFormat('@');}if(sh.getRange(1,1,1,4).getDisplayValues()[0].join('|')!==DEA_REGISTRY_HEADERS_.join('|'))throw Error('Cabeceras del registro incompatibles');return sh;}
function deaRegistryEnsure_(me){const sh=deaRegistryTab_(),id=String(me.id);if(!/^\d{15,22}$/.test(id))throw Error('Discord no verificado');const rows=sh.getDataRange().getDisplayValues().slice(1);if(rows.some(r=>r[0]===id))return;const now=deaNow_();sh.appendRow([id,deaClean_(me.username,48),now,me.app||'OAuth Discord · portal']);deaAudit_('REGISTRO_DISCORD_AUTOMATICO','REGISTROS_DISCORD',id,'',{origen:me.app||'portal'},me,'Alta básica sin permisos administrativos');}
function deaRegistryItems_(){
 const byId=new Map(),agents=deaRows_(deaTab_('AGENTES')),identities=new Map();
 deaIdentitySheet_().getDataRange().getDisplayValues().slice(1).forEach(r=>{if(r[0])identities.set(r[0],r);});
 function add(id,name,date,origin){id=String(id||'');if(!/^\d{15,22}$/.test(id))return;const prev=byId.get(id);if(prev){if(date&&Date.parse(date)<Date.parse(prev.fechaAlta))prev.fechaAlta=date;return;}const i=identities.get(id);byId.set(id,{id:'registro:'+id,discordId:id,discord:name||'Vinculado',habbo:i?.[1]||'Pendiente de completar',fechaAlta:date||'',origen:origin,estado:i?.[6]==='RECHAZADA'?'Rechazada':i?.[1]?'Registrado':'Perfil incompleto',categoria:'',rango:'Sin rango verificado',member:false});}
 deaRegistryTab_().getDataRange().getDisplayValues().slice(1).forEach(r=>add(r[0],r[1],r[2],r[3]));
 deaRows_(deaTab_('SOLICITUDES')).forEach(x=>add(x.row[2],x.row[3],x.row[1],'Solicitud histórica'));
 for(const [id,r] of identities)add(id,'Vinculado',r[4],'Identidad histórica');
 for(const {row:r} of agents){add(r[2],r[3],r[1],'Expediente existente');const item=byId.get(r[2]);if(item)Object.assign(item,{id:r[0],habbo:r[4],discord:r[3]||item.discord,categoria:r[5],rango:r[6],estado:r[9],member:true});}
 for(const {row:r} of deaRows_(deaTab_('FOUNDERS'))){add(r[3],'Vinculado','','Founder existente');const item=byId.get(r[3]);if(item)Object.assign(item,{id:'founder:'+r[0],habbo:r[0],categoria:'Founder',rango:r[2],estado:r[4],founder:true,member:false});}
 return [...byId.values()];
}
function deaRegistryEnrich_(data,me){if(!me.founder)return data;const registros=deaRegistryItems_();data.registros=registros;data.directorio=[...registros,...(data.directorio||[]).filter(x=>!x.discordId&&!registros.some(r=>r.habbo.toLowerCase()===String(x.habbo).toLowerCase()))];data.registroVersion='6.20261112';return data;}
function deaRegistroHistorial(token,offset){deaRequire_(token,true);const start=Number(offset||0);if(!Number.isInteger(start)||start<0)throw Error('Página inválida');const all=deaObjects_('AUDITORIA').filter(x=>/REGISTRO|ALTA_|IDENTIDAD|VINCUL|CARGO_|BAJA|RECTIFIC|ASCENSO/.test(x.accion)).reverse();return {items:all.slice(start,start+100),next:start+100<all.length?start+100:null,total:all.length};}
