/* DEA RADIO STATION — one persistent player, six embedded stations. */
(()=>{'use strict';
if(document.getElementById('dea-radio'))return;
const stations=[
['Colombia Lounge','Chillout · Relax','https://play10.tikast.com/proxy/collounge?mp=/stream'],
['1.FM Chillout','Lounge · Ambient','https://strmreg.1.fm/chilloutlounge_mobile_mp3'],
['FieraMix','Bachata · Merengue','https://c11.radioboss.fm:18269/stream'],
['Chilltrax','Electrónica · Chill','https://streamssl.chilltrax.com/'],
['Cadena Dial','Música española','https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3'],
['Flow Radio','Trap · Urbano','https://st1.urbanrevolution.es:8445/flow.mp3']
];
const root=document.createElement('section');root.id='dea-radio';root.setAttribute('aria-label','DEA Radio Station');
root.innerHTML=`<div class="dr-dock">
<div class="dr-top"><div class="dr-identity"><span class="dr-mark">DEA</span><div class="dr-brand"><strong>DEA RADIO STATION</strong><small data-current-name>01 · Colombia Lounge</small></div></div><button type="button" class="dr-play" data-play aria-label="Reproducir emisora">▶</button></div>
<div class="dr-bottom"><div class="dr-select-wrap"><button type="button" class="dr-picker" data-picker aria-expanded="false" aria-controls="dr-stations">01 · Colombia Lounge <span aria-hidden="true">⌄</span></button><div class="dr-dropdown" id="dr-stations" data-dropdown hidden></div></div><button type="button" class="dr-expand" data-expand aria-label="Abrir las seis emisoras" title="Ver seis emisoras">▣</button></div>
<div class="dr-volume"><span class="dr-volume-icon" aria-hidden="true">◖</span><input type="range" data-volume min="0" max="100" value="55" step="1" aria-label="Volumen de radio de 0 a 100"><output data-volume-label>55%</output></div></div>
<div class="dr-overlay" data-overlay hidden><div class="dr-panel" role="dialog" aria-modal="true" aria-label="Seis emisoras de DEA Radio Station"><div class="dr-panel-head"><div><strong>DEA RADIO STATION</strong><small>Elige una de nuestras 6 emisoras</small></div><button type="button" class="dr-close" data-close aria-label="Cerrar">×</button></div><div class="dr-grid" data-grid></div><p class="dr-status" data-status>Selecciona una emisora para escucharla.</p></div></div>`;
const app=document.getElementById('app');if(app)document.body.insertBefore(root,app);else document.body.appendChild(root);
const audio=new Audio();audio.preload='none';audio.volume=.55;
let selected=0,playing=false,request=0,focusBefore=null;
const $=q=>root.querySelector(q),$$=q=>root.querySelectorAll(q);
const picker=$('[data-picker]'),dropdown=$('[data-dropdown]'),overlay=$('[data-overlay]'),status=$('[data-status]');
stations.forEach((s,i)=>{const label=String(i+1).padStart(2,'0');const btn=document.createElement('button');btn.type='button';btn.className='dr-option';btn.dataset.station=String(i);btn.innerHTML='<b>'+label+'</b><span>'+s[0]+'</span>';dropdown.appendChild(btn);const tile=document.createElement('button');tile.type='button';tile.className='dr-tile';tile.dataset.station=String(i);tile.innerHTML='<span class="dr-number">DEA '+label+'</span><strong>'+s[0]+'</strong><small>'+s[1]+'</small>'; $('[data-grid]').appendChild(tile)});
function paint(){const label=String(selected+1).padStart(2,'0')+' · '+stations[selected][0];$('[data-current-name]').textContent=label;picker.firstChild.textContent=label+' ';$('[data-play]').textContent=playing?'Ⅱ':'▶';$('[data-play]').setAttribute('aria-label',playing?'Pausar emisora':'Reproducir emisora');$$('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.station)===selected)))}
function closeDropdown(){dropdown.hidden=true;picker.setAttribute('aria-expanded','false')}
function stop(){request++;audio.pause();playing=false;paint()}
async function play(){const id=++request;const stream=stations[selected][2];if(audio.getAttribute('src')!==stream){audio.src=stream;audio.load()}status.textContent='Conectando con '+stations[selected][0]+'…';try{await audio.play();if(id!==request)return;playing=true;status.textContent='Escuchando '+stations[selected][0]}catch(e){if(id!==request)return;playing=false;status.textContent='La señal no está disponible. Prueba otra emisora.'}paint()}
function choose(i){if(!Number.isInteger(i)||i<0||i>=stations.length)return;const resume=playing||!audio.paused;stop();selected=i;audio.removeAttribute('src');audio.load();closeDropdown();paint();status.textContent='Seleccionada '+stations[i][0];if(resume)void play()}
root.addEventListener('click',e=>{const station=e.target.closest('[data-station]');if(station){choose(Number(station.dataset.station));if(!overlay.hidden)overlay.hidden=true;return}if(e.target.closest('[data-play]')){playing?stop():void play();return}if(e.target.closest('[data-picker]')){dropdown.hidden=!dropdown.hidden;picker.setAttribute('aria-expanded',String(!dropdown.hidden));return}if(e.target.closest('[data-expand]')){closeDropdown();focusBefore=document.activeElement;overlay.hidden=false;$('[data-close]').focus();return}if(e.target.closest('[data-close]')||e.target===overlay){overlay.hidden=true;focusBefore?.focus?.()}});
document.addEventListener('click',e=>{if(!root.contains(e.target))closeDropdown()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!overlay.hidden){overlay.hidden=true;focusBefore?.focus?.()}closeDropdown()}});
$('[data-volume]').addEventListener('input',e=>{const n=Number(e.target.value);audio.volume=n/100;$('[data-volume-label]').textContent=n+'%';e.target.style.setProperty('--fill',n+'%')});$('[data-volume]').style.setProperty('--fill','55%');
audio.addEventListener('playing',()=>{playing=true;status.textContent='Escuchando '+stations[selected][0];paint()});audio.addEventListener('pause',()=>{playing=false;paint()});audio.addEventListener('error',()=>{playing=false;status.textContent='Señal no disponible. Prueba otra emisora.';paint()});paint();
})();