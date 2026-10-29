/* DEA V6 — lanzadores públicos sin credenciales ni registros. Autorización real: Apps Script + Discord. */
'use strict';
(()=>{
 const root=document.querySelector('[data-founder]');
 if(!root)return;
 const founder=root.getAttribute('data-founder');
 if(!/^[a-zA-Z0-9_.]{2,32}$/.test(founder))return;
 const isMaster=founder==='10PEDRO';
 const founderRoles={'lesslie.ar':'CEO · Primera al mando · Jefa del Departamento de Comunicación','10PEDRO':'CEO · Coordinador de Tecnología Web','XPE_34':'CEO · Coordinador de Eventos','KietsyAndrea':'CEO · Coordinadora de RRHH'};
 const role='FOUNDER · '+(founderRoles[founder]||'CEO');
 const title='DEA CONTROL APP FOUNDER (NO COMPARTIR)';
 const portal='https://script.google.com/macros/s/AKfycbyhGqAW8AiwHt11JBT3jmf2In5do2MRpO-H_urxftlewpJgvmWdQV3mrbQQdtOnYndNEg/exec';
 const actions=[['nominaMiercoles','Pagar nómina · miércoles','wallet','22:00 España peninsular'],['guardaMiercoles','Guardapaga · miércoles','wallet','Reservas y recogidas · 48 horas'],['nominaSabado','Pagar nómina · sábado','wallet','22:00 España peninsular'],['guardaSabado','Guardapaga · sábado','wallet','Reservas y recogidas · 48 horas'],['ventas','Compra de rango','coins','Comprador con expediente activo'],['cobros','Placas','coins','Registrar entrega presencial'],['guardapagaPlaca','Placa Guardapaga','coins','20 c · duración de un mes'],['ascensos','Registrar ascenso','trending-up','Verificación presencial'],['baneados','Incidencias','shield-alert','Anotar sin eliminar'],['auditoria','Mi historial','history','Solo consulta'],['solicitudes','Solicitudes pendientes','clipboard-list','🔔 Revisar en la miniapp privada']];
 if(isMaster) actions.push(['agentes','Directorio general','users','Supervisión Master'],['rangos','Jerarquía y rangos','crown','Consulta de normativa']);
 const icon={ 'clipboard-list':'📋','trending-up':'↗','wallet':'💰','gift':'🎁','shield-alert':'🛡','coins':'🪙','history':'📚','users':'👥','crown':'👑'};
 const el=(id)=>document.getElementById(id);
 el('founder-name').textContent=founder;
 el('founder-rank').textContent=role;
 el('founder-avatar').src=founder==='XPE_34'?'./assets/dea/founder-xpe34.png':'https://www.habbo.es/habbo-imaging/avatarimage?user='+encodeURIComponent(founder)+'&direction=2&head_direction=2&action=std&gesture=sml&size=l';
 el('founder-avatar').alt='Keko Habbo de '+founder;
 document.title=title+' · '+founder;
 function href(tab){return portal+'?founder='+encodeURIComponent(founder)+'&tab='+encodeURIComponent(tab)}
 el('founder-entry').href=href('inicio');
 const grid=el('founder-actions');
 actions.forEach(([tab,label,symbol,detail])=>{
   const a=document.createElement('a');a.className='founder-action';a.href=href(tab);a.rel='noreferrer';
   a.setAttribute('aria-label',label+' — entrar con Discord');
   const i=document.createElement('span');i.className='founder-action-icon';i.textContent=icon[symbol];
   const content=document.createElement('span');content.className='founder-action-text';
   const strong=document.createElement('strong');strong.textContent=label;
   const small=document.createElement('small');small.textContent=detail;
   content.append(strong,small);
   const arrow=document.createElement('span');arrow.className='founder-action-arrow';arrow.textContent='↗';
   a.append(i,content,arrow);grid.append(a);
 });
 el('founder-room').textContent='Sala oficial DEA HABBO ES · nombre por confirmar';
 el('notice-title').textContent=title;
 const mobile=document.querySelector('meta[name=apple-mobile-web-app-title]');
 if(mobile)mobile.content='DEA '+founder;
})();
