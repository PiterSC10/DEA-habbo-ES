(function installTechnicalReport(){
  "use strict";
  const WORK=[
    ["Planificación y arquitectura","Documentación funcional, arquitectura frontend/backend y gestión de permisos.",12,"ok"],
    ["Identidad visual","Escudo, águila, iconos, recursos sociales y tratamiento gráfico.",14,"ok"],
    ["Diseño y navegación adaptable","Portada, menú lateral, rutas SPA, migas de pan y adaptación móvil.",23,"ok"],
    ["Portal público y jerarquía","Agencia, Founders, departamentos, normativa y rangos R1–R10.",17,"ok"],
    ["Centro administrativo VIP","Interfaz y flujos de dirección preparados; pendiente validación real.",13,"pending"],
    ["Identificación Discord OAuth2","Enlace y configuración de autenticación preparados; requiere pruebas de permisos.",8,"pending"],
    ["Google Sheets y Apps Script","Estructura de diez hojas confirmada; conexión integral sin certificar.",14,"pending"],
    ["Solicitudes y expedientes","Modelo de alta R2, aprobación y ficha individual preparada.",9,"pending"],
    ["Ascensos y trazabilidad","Rangos, tiempos mínimos, responsables e historial definidos.",9,"pending"],
    ["Nóminas y pagas extra","Reglas de miércoles, domingo y sábado preparadas.",8,"pending"],
    ["Auditoría y exportaciones","Estructura de eventos y opciones de CSV/avisos definidas.",4,"pending"],
    ["Pruebas locales y documentación","Documentación técnica, casos de prueba y despliegue configurados.",4,"ok"]
  ];
  const HOURS=WORK.reduce((n,w)=>n+w[2],0);
  const CSS=`
#dea-tech-layer[hidden]{display:none!important}
.dea-tech-open{font:inherit!important;display:inline-flex;align-items:center;gap:5px;margin:4px 0 0 12px;padding:5px 9px!important;border:1px solid #60758b!important;border-radius:7px;color:#c7d9e9!important;background:transparent!important;cursor:pointer;font-size:11px!important;letter-spacing:.01em;vertical-align:middle}
.dea-tech-open:hover,.dea-tech-open:focus-visible{border-color:#d9ba7b!important;color:#fff!important;outline-offset:3px}
#dea-tech-layer{position:fixed;inset:0;z-index:99999;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#f1f7ff}
#dea-tech-layer *,#dea-tech-layer *:before,#dea-tech-layer *:after{box-sizing:border-box}
.dea-tech-backdrop{position:absolute;inset:0;background:#020915d9;backdrop-filter:blur(8px)}
.dea-tech-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(910px,calc(100vw - 28px));max-height:90dvh;overflow-y:auto;background:#0b1b2d;border:1px solid #405d79;border-radius:18px;box-shadow:0 30px 100px #000c}
.dea-tech-head{padding:24px 26px 18px;background:linear-gradient(120deg,#173454,#0b1c30);border-bottom:1px solid #38516c}
.dea-tech-eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#dabe82;font-weight:850}
.dea-tech-title-line{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-top:7px}
.dea-tech-title{font-size:clamp(21px,4vw,29px);font-weight:850;line-height:1.2;margin:0!important;color:#f6f9fe}
.dea-tech-sub{font-size:12px;line-height:1.65;color:#a9c1d6;margin:8px 0 0}
.dea-tech-close{flex:none;border:1px solid #47627e;border-radius:9px;color:#e8f3ff;background:#1d3650;cursor:pointer;width:35px;height:35px;font-size:22px}
.dea-tech-content{padding:21px 26px 25px}
.dea-tech-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-bottom:22px}
.dea-tech-metric{border:1px solid #38516a;border-radius:11px;background:#102940;padding:13px}
.dea-tech-metric strong{display:block;color:#fff;font-size:20px;font-variant-numeric:tabular-nums}
.dea-tech-metric span{font-size:10px;color:#b2c6d9}
.dea-tech-section{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:20px 0 10px}
.dea-tech-section h3{font-size:14px;font-weight:850;margin:0;color:#eaf3ff}
.dea-tech-hint{font-size:11px;color:#9ab2c7}
.dea-tech-work{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.dea-tech-job{display:flex;align-items:flex-start;gap:10px;border:1px solid #2b4560;border-radius:10px;padding:12px 11px;background:#11273c}
.dea-tech-mark{display:grid;place-items:center;flex:none;border-radius:100%;width:19px;height:19px;font-size:12px;font-weight:900;background:#163d37;color:#84e2b3;border:1px solid #4a9b78}
.dea-tech-mark.pending{background:#3b301d;color:#f1cd83;border-color:#b68b45}
.dea-tech-job b{display:block;font-size:12px;line-height:1.35;color:#eef6ff}
.dea-tech-job p{font-size:11px;color:#9fb8ce;line-height:1.5;margin:4px 0 0}
.dea-tech-job .hours{font-size:11px;font-weight:850;color:#c8dded;white-space:nowrap;margin-left:auto;padding-left:5px}
.dea-tech-bar{height:7px;border-radius:10px;background:#263c52;overflow:hidden;margin-top:11px}
.dea-tech-bar>div{width:0%;height:100%;background:linear-gradient(90deg,#53b5e7,#7adcae);transition:width .25s ease}
.dea-tech-scan-row{display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-bottom:1px solid #253e56;font-size:11px;line-height:1.5}
.dea-tech-scan-row:last-child{border:0}
.dea-tech-scan-row .dea-tech-mark{width:17px;height:17px;font-size:11px}
.dea-tech-scan-row .detail{display:block;color:#94abc1;font-size:10px;margin-top:2px}
.dea-tech-run{display:inline-flex;align-items:center;gap:6px;border-radius:7px;border:1px solid #4c91be;background:#133956;color:#e1f3ff;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}
.dea-tech-run:disabled{opacity:.55;cursor:wait}
.dea-tech-note{margin:15px 0 0;border-left:2px solid #c39a50;background:#2c281e5e;padding:11px 12px;color:#cfdae6;font-size:11px;line-height:1.55}
.dea-tech-foot{border-top:1px solid #34506a;margin-top:21px;padding-top:13px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}
.dea-tech-foot p{margin:0;font-size:10px;color:#afc1d2;line-height:1.6}
.dea-tech-foot b{color:#e7d1a3}
.dea-tech-progress-text{font-size:10px;color:#a9c6dc;min-height:17px}
@media(max-width:630px){.dea-tech-head{padding:18px 16px}.dea-tech-content{padding:15px}.dea-tech-work{grid-template-columns:1fr}.dea-tech-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.dea-tech-metric{padding:9px 7px}.dea-tech-metric strong{font-size:17px}.dea-tech-modal{width:calc(100vw - 16px);max-height:94dvh}.dea-tech-foot{display:block}.dea-tech-foot p+p{margin-top:7px}}
@media(prefers-reduced-motion:reduce){.dea-tech-bar>div{transition:none}}
`;
  function q(s,parent=document){return parent.querySelector(s)}
  function h(el,html){el.innerHTML=html;return el}
  const stylesheet=document.createElement("style");
  stylesheet.id="dea-tech-styles";
  stylesheet.textContent=CSS;
  document.head.append(stylesheet);
  const layer=document.createElement("div");
  layer.id="dea-tech-layer";layer.hidden=true;
  const tiles=WORK.map(([name,desc,hours,status])=>`
    <article class="dea-tech-job"><span class="dea-tech-mark${status==="pending"?" pending":""}" aria-label="${status==="pending"?"Por validar":"Trabajo verificado"}">${status==="pending"?"!":"✓"}</span>
    <div><b>${name}</b><p>${desc}</p></div><span class="hours">${hours} h</span></article>`).join("");
  h(layer,`<div class="dea-tech-backdrop" data-dea-tech-close></div><section class="dea-tech-modal" role="dialog" aria-modal="true" aria-labelledby="dea-tech-title" tabindex="-1">
    <header class="dea-tech-head">
     <div class="dea-tech-eyebrow">Just Design GPT · Memoria técnica · Octubre 2026</div>
     <div class="dea-tech-title-line"><h2 class="dea-tech-title" id="dea-tech-title">DEA HABBO ES · Informe V6</h2><button type="button" class="dea-tech-close" aria-label="Cerrar informe" data-dea-tech-close>×</button></div>
     <p class="dea-tech-sub">Ficha técnica de desarrollo y diagnóstico de recursos públicos. Separa los módulos preparados de las integraciones verificadas en producción.</p>
    </header>
    <div class="dea-tech-content">
     <div class="dea-tech-summary">
      <div class="dea-tech-metric"><strong>${HOURS} h</strong><span>Esfuerzo equivalente estimado</span></div>
      <div class="dea-tech-metric"><strong>${WORK.length}</strong><span>Áreas documentadas</span></div>
      <div class="dea-tech-metric"><strong>V6</strong><span>Proyecto en preinauguración</span></div>
     </div>
     <div class="dea-tech-section"><h3>Relación de trabajos</h3><span class="dea-tech-hint">✓ Documentado · ! Requiere validación</span></div>
     <div class="dea-tech-work">${tiles}</div>
     <div class="dea-tech-section"><h3>Escáner de tecnología pública</h3><button type="button" class="dea-tech-run" id="dea-tech-run">↻ Analizar de nuevo</button></div>
     <p class="dea-tech-hint">Comprobaciones reales de archivos y configuración accesibles al navegador.</p>
     <div class="dea-tech-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="dea-tech-bar"><div></div></div>
     <p class="dea-tech-progress-text" id="dea-tech-progress">Preparado para analizar.</p>
     <div id="dea-tech-results" aria-live="polite"></div>
     <p class="dea-tech-note"><strong>Alcance del diagnóstico:</strong> las comprobaciones del navegador no certifican permisos de Discord, sesiones OAuth2, funciones privadas de Apps Script, acceso a Google Sheets ni seguridad del backend. Estos puntos requieren pruebas específicas con usuarios reales y autorización.</p>
     <footer class="dea-tech-foot">
       <p><b>Valoración orientativa del desarrollo preparado: 4.050 € + IVA.</b><br/>Referencia del proyecto completo, una vez validado y entregado: 5.400 € + IVA. Sin precios por módulo.</p>
       <p>135 horas profesionales equivalentes · No es factura ni parte real de horas.</p>
     </footer>
    </div>
  </section>`);
  document.body.append(layer);
  let returnFocus=null;
  let running=false;
  const bar=q("#dea-tech-bar",layer);
  const barline=q("#dea-tech-bar > div",layer);
  const progress=q("#dea-tech-progress",layer);
  const results=q("#dea-tech-results",layer);
  const runBtn=q("#dea-tech-run",layer);
  const modal=q(".dea-tech-modal",layer);
  function entry(result){
    const row=document.createElement("div");
    row.className="dea-tech-scan-row";
    const badge=document.createElement("span");
    badge.className="dea-tech-mark"+(result.state==="ok"?"":" pending");
    badge.textContent=result.state==="ok"?"✓":result.state==="warn"?"!":"×";
    const text=document.createElement("div");
    const strong=document.createElement("strong");strong.textContent=result.title;
    const detail=document.createElement("span");detail.className="detail";detail.textContent=result.details;
    text.append(strong,detail);row.append(badge,text);results.append(row);
  }
  async function get(path,kind="text"){
    const url=new URL(path,document.baseURI);
    if(url.origin!==location.origin)throw Error("Recurso externo no inspeccionado");
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),6000);
    try{
      const response=await fetch(url.href,{cache:"no-store",signal:ctrl.signal});
      if(!response.ok)throw Error(`HTTP ${response.status}`);
      return kind==="json"?response.json():response.text();
    }finally{clearTimeout(timer)}
  }
  function fmt(str){return new Intl.NumberFormat("es-ES").format(str)}
  const tasks=[
    ["HTML5 y estructura",async()=>({state:document.doctype?.name==="html"&&!!document.getElementById("app")?"ok":"warn",details:"Documento HTML5 y contenedor principal de la aplicación."})],
    ["JavaScript principal",async()=>{
      const src=await get("./app.js");
      return {state:src.includes("function render()")?"ok":"warn",details:`app.js · ${fmt(new Blob([src]).size)} bytes · ${fmt(src.split("\n").length)} líneas · navegación SPA`};
    }],
    ["Estilos y diseño responsive",async()=>{
      const css=await get("./styles.css");
      return {state:css.includes("@media")&&css.includes(".choice")?"ok":"warn",details:`styles.css · ${fmt(new Blob([css]).size)} bytes · estilos y media queries detectados`};
    }],
    ["Marca y recursos gráficos",async()=>{
      const checks=await Promise.allSettled(["./logo-dea-es.png","./aguila-dea-original.jpg"].map(x=>get(x)));
      return {state:checks.every(x=>x.status==="fulfilled")?"ok":"warn",details:`Escudo y águila: ${checks.filter(x=>x.status==="fulfilled").length}/2 recursos accesibles`};
    }],
    ["SEO y vista en redes",async()=>({
      state:q('link[rel="canonical"]')&&q('meta[property="og:image"]')?"ok":"warn",
      details:"Dirección canónica, imagen Open Graph y metadatos presentes en HTML."
    })],
    ["Manifiesto de instalación",async()=>{
      const m=await get("./site.webmanifest","json");
      return {state:m?.name==="DEA HABBO ES"?"ok":"warn",details:`Manifiesto: ${m?.name||"sin nombre"} · ${m?.icons?.length||0} iconos declarados. No implica PWA offline.`};
    }],
    ["Indexación en buscadores",async()=>{
      const robots=q('meta[name="robots"]')?.content||"";
      return {state:"warn",details:robots.includes("noindex")?"Bloqueo noindex activado intencionadamente durante la preinauguración.":"Revisar estado de indexación antes de lanzamiento."};
    }],
    ["Conexión visual con el portal privado",async()=>{
      const js=await get("./app.js");
      const configured=/https:\/\/script\.google\.com\/macros\/s\/[^"'\s]+\/exec/.test(js);
      return {state:"warn",details:configured?"URL Apps Script enlazada en la web. No se valida OAuth2 ni seguridad del backend.":"No se detectó la URL de Apps Script en el cliente público."};
    }],
    ["Discord, Sheets y operaciones privadas",async()=>({state:"warn",details:"Arquitectura y esquemas documentados. Autorización, expedientes, ascensos y nóminas requieren pruebas de extremo a extremo."})]
  ];
  tasks.splice(3,0,
    ["Accesos y rutas principales",async()=>{
      const src=await get("./app.js");
      const entries=["ACCESO VIP","ÚNETE A DEA","WEB PÚBLICA"];
      return {state:entries.every(x=>src.includes(x))?"ok":"warn",details:"Portada SPA con tres accesos diferenciados: VIP, agentes y contenido público."};
    }],
    ["Páginas institucionales",async()=>{
      const src=await get("./app.js");
      const routes=["publico/agencia","publico/jerarquia","publico/departamentos","publico/founders","publico/ingreso","publico/normativa"];
      const found=routes.filter(x=>src.includes(x)).length;
      return {state:found===routes.length?"ok":"warn",details:`${found}/${routes.length} rutas institucionales encontradas en JavaScript.`};
    }],
    ["Jerarquía y modelo de rangos",async()=>{
      const src=await get("./app.js");
      const found=Array.from({length:10},(_,i)=>"id:'R"+(i+1)+"'").filter(x=>src.includes(x)).length;
      return {state:found===10?"ok":"warn",details:`Definiciones R1–R10: ${found}/10; los rangos sin aprobar se mantienen pendientes.`};
    }],
    ["Preinauguración y acceso temporal",async()=>{
      const src=await get("./app.js");
      const present=src.includes("PREVIEW_SESSION_KEY")&&src.includes("crypto.subtle.digest");
      return {state:present?"ok":"warn",details:"Pantalla de vista previa detectada. Control visual cliente; no es seguridad de servidor."};
    }],
    ["Accesibilidad y movimiento reducido",async()=>{
      const css=await get("./styles.css");
      const ok=css.includes("focus-visible")&&css.includes("prefers-reduced-motion");
      return {state:ok?"ok":"warn",details:"Indicadores de foco y estilos para usuarios que prefieren menos animación."};
    }],
    ["Adaptación móvil y metadatos viewport",async()=>{
      const css=await get("./styles.css");
      const breakpoints=(css.match(/@media/g)||[]).length;
      return {state:breakpoints>0&&!!q('meta[name="viewport"]')?"ok":"warn",details:`${breakpoints} reglas @media detectadas; etiqueta viewport presente.`};
    }]
  );
  async function scan(){
    if(running)return;
    running=true;runBtn.disabled=true;
    results.replaceChildren();barline.style.width="0%";bar.setAttribute("aria-valuenow","0");
    let ok=0;
    for(let i=0;i<tasks.length;i++){
      const [title,task]=tasks[i];
      progress.textContent=`Analizando ${i+1}/${tasks.length}: ${title}`;
      let result;
      try{result=await task()}catch(e){result={state:"warn",details:"No se pudo comprobar este recurso desde el navegador: "+(e?.message||"error de red")}}
      entry({title,...result});if(result.state==="ok")ok++;
      const pct=Math.round((i+1)*100/tasks.length);barline.style.width=pct+"%";bar.setAttribute("aria-valuenow",String(pct));
    }
    progress.textContent=`Diagnóstico finalizado · ${ok} verificaciones positivas de ${tasks.length}. Los avisos no son fallos de seguridad acreditados.`;
    runBtn.disabled=false;running=false;
  }
  let oldOverflow="";
  function show(){
    if(!layer.hidden)return;
    returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;document.body.style.overflow="hidden";
    layer.hidden=false;modal.focus();void scan();
  }
  function close(){
    layer.hidden=true;document.body.style.overflow=oldOverflow;
    if(returnFocus?.isConnected)returnFocus.focus();
  }
  layer.addEventListener("click",e=>{
    if(e.target.closest("[data-dea-tech-close]"))close();
    else if(e.target.closest("#dea-tech-run"))void scan();
  });
  document.addEventListener("keydown",e=>{
    if(layer.hidden)return;
    if(e.key==="Escape")close();
    if(e.key==="Tab"){
      const focusable=[...layer.querySelectorAll('button:not(:disabled)')];
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
    }
  });
  function decorateFooter(){
    for(const foot of document.querySelectorAll("#app .home-foot,#app .foot,#app .dea-preview-footer")){
      if(foot.querySelector(".dea-tech-open"))continue;
      const button=document.createElement("button");button.type="button";button.className="dea-tech-open";
      button.textContent="↗ Informe técnico · V6";button.setAttribute("aria-haspopup","dialog");
      button.addEventListener("click",show);foot.append(button);
    }
  }
  decorateFooter();
  const root=document.getElementById("app");
  if(root)new MutationObserver(decorateFooter).observe(root,{childList:true,subtree:true});
})();
