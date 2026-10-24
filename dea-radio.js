/* DEA RADIO STATION — one persistent player, 15 stations, direct audio only. */
(()=>{'use strict';
function mountRadio(){
if(document.getElementById('dea-radio'))return;
const stations=[
['Colombia Lounge','Chillout · Relax','https://play10.tikast.com/proxy/collounge?mp=/stream'],
['1.FM Chillout','Lounge · Ambient','https://strmreg.1.fm/chilloutlounge_mobile_mp3'],
['FieraMix','Bachata · Merengue','https://c11.radioboss.fm:18269/stream'],
['Chilltrax','Electrónica · Chill','https://streamssl.chilltrax.com/'],
['Cadena Dial','Música española','https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3'],
['TRAP RADIO','Trap · Hip-hop','https://trapradio.streamingmedia.it/play'],
['Ibiza Global Radio','House · Electrónica · Ibiza','https://listenssl.ibizaglobalradio.com:8024/stream'],
['Capital London','Pop · Éxitos británicos','https://media-ssl.musicradio.com/CapitalMP3'],
['Zona Rap','Rap · Hip-hop en español','https://radio.zonarap.es/listen/zona_rap_radio/radio.mp3'],
['LOS40 Urban','Trap latino · Reguetón','https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3'],
['Tomorrowland One World Radio','EDM · House · Festivales','https://playerservices.streamtheworld.com/api/livestream-redirect/OWR_INTERNATIONAL.mp3'],
['Radio Disney Argentina','Éxitos latinos · Argentina','https://playerservices.streamtheworld.com/api/livestream-redirect/DISNEY_ARG_BA.mp3'],
['LOS40 México','Pop latino · Éxitos','https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_MEXICOAAC.aac'],
['EXA FM México','Hits · Música juvenil','https://playerservices.streamtheworld.com/api/livestream-redirect/XHEXA.mp3'],
['Solo Reggaetón','Reguetón · Música urbana','https://c13.radioboss.fm:18182/stream']
];
const details=[
['Colombia','Colombia','collounge.com'],
['Internacional','Global','1.fm'],
['Internacional','Global','fieramix.com'],
['Estados Unidos','EE. UU.','chilltrax.com'],
['España','España','cadenadial.com'],
['Estados Unidos','Nueva York','trap.radio'],
['España','Ibiza','ibizaglobalradio.com'],
['Reino Unido','Londres','capitalfm.com'],
['España','España','zonarap.es'],
['España','Madrid','los40.com'],
['Bélgica','Tomorrowland','tomorrowland.com'],
['Argentina','Buenos Aires','ar.radiodisney.com'],
['México','Ciudad de México','los40.com.mx'],
['México','Ciudad de México','exafm.com'],
['República Dominicana','Online','fieramix.com']
];
const logo=i=>'https://www.google.com/s2/favicons?domain='+encodeURIComponent(details[i][2])+'&sz=128';
const badge=i=>'<span class="dr-logo"><img src="'+logo(i)+'" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.textContent=\'DEA\'"></span>';
const root=document.createElement('section');root.id='dea-radio';root.setAttribute('aria-label','DEA Radio Station');
root.innerHTML=`<div class="dr-dock">
<div class="dr-top"><div class="dr-identity"><span class="dr-mark" data-current-logo>DEA</span><div class="dr-brand"><strong>DEA RADIO STATION</strong><small data-current-name>01 · Colombia Lounge</small></div></div><button type="button" class="dr-play" data-play aria-label="Reproducir emisora">▶</button></div>
<div class="dr-bottom"><div class="dr-select-wrap"><button type="button" class="dr-picker" data-picker aria-expanded="false" aria-controls="dr-stations">01 · Colombia Lounge <span aria-hidden="true">⌄</span></button><div class="dr-dropdown" id="dr-stations" data-dropdown hidden></div></div><button type="button" class="dr-expand" data-expand aria-label="Abrir las quince emisoras" title="Ver quince emisoras">15</button></div>
</div>
<div class="dr-overlay" data-overlay hidden><div class="dr-panel" role="dialog" aria-modal="true" aria-label="Quince emisoras de DEA Radio Station"><div class="dr-panel-head"><div><strong>DEA RADIO STATION</strong><small>Elige una de nuestras 15 emisoras</small></div><button type="button" class="dr-close" data-close aria-label="Cerrar">×</button></div><div class="dr-grid" data-grid></div><p class="dr-status" data-status>Selecciona una emisora para escucharla.</p></div></div>`;
const app=document.getElementById('app');if(app)document.body.insertBefore(root,app);else document.body.appendChild(root);
const audio=new Audio();audio.preload='none';audio.volume=1;
let selected=0,playing=false,request=0,focusBefore=null;
const $=q=>root.querySelector(q),$$=q=>root.querySelectorAll(q);
const picker=$('[data-picker]'),dropdown=$('[data-dropdown]'),overlay=$('[data-overlay]'),status=$('[data-status]');
stations.forEach((s,i)=>{const label=String(i+1).padStart(2,'0');const btn=document.createElement('button');btn.type='button';btn.className='dr-option';btn.dataset.station=String(i);btn.innerHTML=badge(i)+'<span class="dr-option-text"><strong>'+label+' · '+s[0]+'</strong><small>'+details[i][0]+' · '+s[1]+'</small></span>';dropdown.appendChild(btn);const tile=document.createElement('button');tile.type='button';tile.className='dr-tile';tile.dataset.station=String(i);tile.innerHTML=badge(i)+'<span class="dr-number">DEA '+label+'</span><strong>'+s[0]+'</strong><small>'+details[i][0]+' · '+details[i][1]+'</small><small>'+s[1]+'</small>'; $('[data-grid]').appendChild(tile)});
function paint(){const label=String(selected+1).padStart(2,'0')+' · '+stations[selected][0];$('[data-current-name]').textContent=label+' · '+details[selected][0];$('[data-current-logo]').innerHTML='<img src="'+logo(selected)+'" alt="" onerror="this.style.display=\'none\';this.parentNode.textContent=\'DEA\'">';picker.firstChild.textContent=label+' ';$('[data-play]').textContent=playing?'Ⅱ':'▶';$('[data-play]').setAttribute('aria-label',playing?'Pausar emisora':'Reproducir emisora');$$('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.station)===selected)))}
function closeDropdown(){dropdown.hidden=true;picker.setAttribute('aria-expanded','false')}
function stop(){request++;audio.pause();playing=false;paint()}
async function play(){const id=++request;const stream=stations[selected][2];if(audio.getAttribute('src')!==stream){audio.src=stream;audio.load()}status.textContent='Conectando con '+stations[selected][0]+'…';try{await audio.play();if(id!==request)return;playing=true;status.textContent='Escuchando '+stations[selected][0]}catch(e){if(id!==request)return;playing=false;status.textContent='La señal no está disponible. Prueba otra emisora.'}paint()}
function choose(i){if(!Number.isInteger(i)||i<0||i>=stations.length)return;stop();selected=i;audio.removeAttribute('src');audio.load();closeDropdown();paint();status.textContent='Seleccionada '+stations[i][0];void play()}
root.addEventListener('click',e=>{const station=e.target.closest('[data-station]');if(station){choose(Number(station.dataset.station));if(!overlay.hidden)overlay.hidden=true;return}if(e.target.closest('[data-play]')){playing?stop():void play();return}if(e.target.closest('[data-picker]')){dropdown.hidden=!dropdown.hidden;picker.setAttribute('aria-expanded',String(!dropdown.hidden));return}if(e.target.closest('[data-expand]')){closeDropdown();focusBefore=document.activeElement;overlay.hidden=false;$('[data-close]').focus();return}if(e.target.closest('[data-close]')||e.target===overlay){overlay.hidden=true;focusBefore?.focus?.()}});
document.addEventListener('click',e=>{if(!root.contains(e.target))closeDropdown()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!overlay.hidden){overlay.hidden=true;focusBefore?.focus?.()}closeDropdown()}});

audio.addEventListener('playing',()=>{playing=true;status.textContent='Escuchando '+stations[selected][0];paint()});audio.addEventListener('pause',()=>{playing=false;paint()});audio.addEventListener('error',()=>{playing=false;status.textContent='Señal no disponible. Prueba otra emisora.';paint()});paint();
}
mountRadio();
})();
