/* Reversible theme controller. The unmodified DEA base remains the original skin. */
(()=>{'use strict';const key='dea-habboween-2026-v2';let mode='habboween';try{mode=localStorage.getItem(key)||'habboween'}catch(_){}
 const ribbon=document.createElement('div');ribbon.id='dea-hw-ribbon';ribbon.textContent='¡FELIZ HALLOWEEN 2026! · DEA HABBOWEEN';
 const btn=document.createElement('button');btn.id='dea-hw-switch';btn.type='button';btn.setAttribute('aria-label','Cambiar apariencia original o Habboween');
 function excluded(){return /(?:^|\/)(?:founders|founder(?:-|\/)|vip|ficha)(?:\/|$)|identificacion\/vip/i.test((location.hash||'').replace(/^#\/?/,''))}
 function apply(){const show=!excluded();document.body.classList.toggle('dea-hw-v2',show&&mode==='habboween');btn.hidden=!show;btn.textContent=mode==='habboween'?'Ver DEA original':'Activar Habboween'}
 btn.addEventListener('click',()=>{mode=mode==='habboween'?'original':'habboween';try{localStorage.setItem(key,mode)}catch(_){}apply()});
 document.body.prepend(ribbon);document.body.append(btn);window.addEventListener('hashchange',apply);apply();
})();
