/* DEA Habboween 2026: capa visual reversible; sin alterar navegación, contenido ni permisos. */
(()=>{'use strict';
 const key='dea-seasonal-skin-v1';let enabled=true;
 try{enabled=localStorage.getItem(key)!=='original'}catch(_){}
 const style=document.createElement('style');style.textContent=`
 body.dea-habboween{--hw-orange:#f9a34c}
 body.dea-habboween .shell-home,body.dea-habboween #app{position:relative}
 body.dea-habboween .shell-home:before,body.dea-habboween .shell-home:after{position:fixed;z-index:8;pointer-events:none;font-size:clamp(24px,5vw,56px);filter:drop-shadow(0 0 12px #ff9e4066)}
 body.dea-habboween .shell-home:before{content:'🎃';left:1%;bottom:3%}
 body.dea-habboween .shell-home:after{content:'👻';right:2%;top:16%;animation:dea-ghost 5s ease-in-out infinite}
 body.dea-habboween .home-bar,body.dea-habboween .home-foot,body.dea-habboween .foot{border-color:#d17b46!important}
 body.dea-habboween .choice,body.dea-habboween .rank-row,body.dea-habboween .public-quick-link{box-shadow:0 0 0 1px #e18c4822,0 0 20px #a35d2d16}
 #dea-hw-decoration{position:fixed;inset:0;z-index:9;pointer-events:none;overflow:hidden}
 #dea-hw-decoration .hw-top{position:absolute;left:0;right:0;top:0;height:10px;background:linear-gradient(90deg,transparent,#c86a38,#8e5ec5,#e6a05e,transparent);opacity:.65}
 #dea-hw-decoration .hw-corner{position:absolute;font-size:clamp(20px,3.4vw,42px);filter:drop-shadow(0 0 8px #e7835580)}
 #dea-hw-decoration .hw-left{top:12%;left:8px}#dea-hw-decoration .hw-right{top:12%;right:8px}
 #dea-hw-decoration .hw-bottom{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:clamp(18px,3vw,30px);opacity:.9}
 #dea-hw-decoration .hw-greeting{position:absolute;top:13px;left:50%;transform:translateX(-50%);white-space:nowrap;background:#141b2eea;border:1px solid #c77948;border-radius:999px;color:#ffd7a4;padding:5px 14px;font:700 11px system-ui,sans-serif;letter-spacing:.07em;box-shadow:0 2px 18px #0008}
 #dea-hw-toggle{position:fixed;right:12px;bottom:12px;z-index:9990;background:#15253a;color:#ffdbac;border:1px solid #e39450;border-radius:999px;padding:8px 12px;font:700 11px system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 16px #0009}
 #dea-hw-toggle:focus-visible{outline:3px solid #fff;outline-offset:2px}
 @keyframes dea-ghost{50%{transform:translateY(-10px)}}
 @media(max-width:640px){#dea-hw-decoration .hw-greeting{top:6px;font-size:9px;padding:4px 8px}#dea-hw-decoration .hw-left,#dea-hw-decoration .hw-right{top:24%;font-size:20px}#dea-hw-decoration .hw-bottom{bottom:52px}#dea-hw-toggle{right:7px;bottom:7px;padding:6px 9px;font-size:10px}}
 @media(prefers-reduced-motion:reduce){body.dea-habboween .shell-home:after{animation:none}}
 `;document.head.append(style);
 const decor=document.createElement('div');decor.id='dea-hw-decoration';decor.setAttribute('aria-hidden','true');decor.innerHTML='<div class="hw-top"></div><span class="hw-corner hw-left">🕸️🎃</span><span class="hw-corner hw-right">🦇👻</span><span class="hw-bottom">🍬 🎃 🍭</span><span class="hw-greeting">🎃 ¡FELIZ HALLOWEEN 2026! · HABBOWEEN</span>';
 const button=document.createElement('button');button.id='dea-hw-toggle';button.type='button';button.setAttribute('aria-label','Cambiar entre la skin original y Habboween');
 function permitted(){const hash=decodeURIComponent(location.hash||'').toLowerCase();return !/founder|\/vip|identificacion\/vip|\/ficha/.test(hash)}
 function refresh(){const active=enabled&&permitted();document.body.classList.toggle('dea-habboween',active);decor.hidden=!active;button.hidden=!permitted();button.textContent=enabled?'🎃 Habboween · Desactivar':'🎃 Activar Habboween';}
 button.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'habboween':'original')}catch(_){}refresh()});
 document.body.append(decor,button);window.addEventListener('hashchange',refresh);refresh();
})();
