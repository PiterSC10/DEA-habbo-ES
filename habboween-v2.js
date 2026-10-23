/* Reversible theme controller. The unmodified DEA base remains the original skin. */
(()=>{'use strict';const key='dea-habboween-2026-v2';let mode='habboween';try{mode=localStorage.getItem(key)||'habboween'}catch(_){}
 const ribbon=document.createElement('div');ribbon.id='dea-hw-ribbon';ribbon.textContent='¡FELIZ HALLOWEEN 2026! · DEA HABBOWEEN';
 const btn=document.createElement('button');btn.id='dea-hw-switch';btn.type='button';btn.setAttribute('aria-label','Cambiar apariencia original o Habboween');
 function excluded(){return /(?:^|\/)(?:founders|founder(?:-|\/)|vip|ficha)(?:\/|$)|identificacion\/vip/i.test((location.hash||'').replace(/^#\/?/,''))}
 const scene=document.createElement('div');scene.className='hw-page-scene';scene.setAttribute('aria-hidden','true');scene.innerHTML='<img src="./habboween-candles.svg" alt=""><img class="hw-bat" src="./habboween-bat.svg" alt=""><div><strong>¡FELIZ HALLOWEEN 2026!</strong><small>DEA · HABBOWEEN</small></div><img class="hw-bat" src="./habboween-skull.svg" alt=""><img src="./habboween-pumpkin.svg" alt="">';
 function syncScene(){const root=document.getElementById('app');if(!root)return;const container=root.querySelector('.app-area-publico, .app-area-unete');if(!container){scene.remove();return}const target=container.querySelector('main, .main, .content, .page-content');if(target){if(scene.parentNode!==target)target.prepend(scene)}else{if(scene.parentNode!==container)container.append(scene)}}
 function apply(){const show=!excluded();document.body.classList.toggle('dea-hw-v2',show&&mode==='habboween');btn.hidden=!show;btn.textContent=mode==='habboween'?'🎃 Desactivar Habboween':'🎃 Activar Habboween';syncScene()}
 btn.addEventListener('click',()=>{mode=mode==='habboween'?'original':'habboween';try{localStorage.setItem(key,mode)}catch(_){}apply()});
 document.body.prepend(ribbon);document.body.append(btn);window.addEventListener('hashchange',()=>requestAnimationFrame(apply));const root=document.getElementById('app');if(root){const obs=new MutationObserver(()=>{if(scene.parentNode&&!document.contains(scene))scene.remove();syncScene()});obs.observe(root,{childList:true,subtree:false})}apply();
})();
