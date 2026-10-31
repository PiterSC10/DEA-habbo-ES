(function installWebCheckScan(){
  "use strict";
  const WORK=[
    ["Análisis de requisitos y arquitectura","Alcance funcional, decisiones técnicas y diseño de arquitectura.",14,"ok"],
    ["Identidad corporativa y diseño gráfico","Escudo, águila, paleta institucional y elementos visuales.",12,"ok"],
    ["Desarrollo frontend responsive","HTML5, CSS3, JavaScript, vistas accesibles y adaptación móvil.",20,"ok"],
    ["Navegación y estructura institucional","Portada, menús, rutas públicas, jerarquía y normativa.",14,"ok"],
    ["Panel administrativo VIP","Interfaz del centro de dirección; validación privada pendiente.",18,"pending"],
    ["Sistema de identificación Discord","Integración OAuth2 documentada; permisos de sesión por verificar.",12,"pending"],
    ["Google Apps Script y Sheets","Esquemas y conexión documentados; pruebas privadas pendientes.",14,"pending"],
    ["Gestión de agentes y expedientes","Flujos de alta, consulta individual, solicitudes y aprobaciones.",12,"pending"],
    ["Rangos y ascensos","Modelo R1–R10 y reglas de autorización acumulativas.",10,"ok"],
    ["Nóminas y Guardapaga","Reglas, formularios y trazabilidad sujetos a validación privada.",9,"pending"],
    ["Auditoría y trazabilidad","Diseño de historial y registros de operaciones no eliminables.",8,"pending"],
    ["Miniapps Founder","Cuatro accesos personalizados; permisos efectivos en servidor privado.",12,"ok"],
    ["Miniapps Directores y Managers","Dos lanzadores de cargo con límites publicados R5/R7 incluidos.",10,"ok"],
    ["Catálogo de placas","Página y estructura preparadas; artículos por aprobar.",8,"ok"],
    ["Despliegue y documentación técnica","GitHub, Vercel, controles SEO y documentación de integración.",7,"ok"],
    ["DEA Radio Station","Mini reproductor compacto, once emisoras y selección de radio tras acceso.",9,"ok"],
    ["Control de visitas DEA","Contador, historial diario, filtros 7/15/30 días y gráfica compacta.",10,"ok"],
    ["Preinauguración y privacidad visual","Pantalla de contraseña, radio diferida y contador clasificado.",6,"ok"],
    ["Founders y dirección corporativa","Cuatro perfiles CEO, responsabilidades y avatares de Habbo.",5,"ok"],
    ["Sala DEA y banderines","Secciones públicas preparadas con contenido próximamente.",4,"ok"],
    ["Noticias y comunicación DEA","Sección de actualidad y anuncio de preinauguración.",4,"ok"],
    ["Navegación móvil y accesibilidad","Orden del menú, avisos y estabilidad de navegación.",5,"ok"]
  ];
  const HOURS=WORK.reduce((n,w)=>n+w[2],0);
  const ESTIMATED_RATE_CURRENT=35;
  const ESTIMATED_RATE_VALIDATED=50;
  const formatEuros=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
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

/* WEB CHECK SCAN V6: extensión visual del informe técnico, sin tocar estilos globales. */
.dea-tech-open{border-color:#4c7289!important;border-radius:999px!important;background:#0c263c!important;color:#b9efdd!important;font-weight:800!important;box-shadow:inset 0 0 0 1px #1c524866}
.dea-tech-open:hover,.dea-tech-open:focus-visible{color:#f2ffe9!important;border-color:#78dfae!important;box-shadow:0 0 16px #3fce8266}
#dea-tech-layer .dea-tech-backdrop{background:#020811e9}
#dea-tech-layer .dea-tech-modal{border:1px solid #396c89;box-shadow:0 0 0 1px #c6a76d22,0 35px 110px #000e}
.dea-tech-eyebrow{color:#b9eacb}
.dea-tech-report{border:1px solid #415f79;border-radius:13px;margin-top:21px;background:#0f2438;overflow:hidden}
.dea-tech-report>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:17px 18px;cursor:pointer;color:#f4d796;font-size:13px;font-weight:850;letter-spacing:.07em}
.dea-tech-report>summary::-webkit-details-marker{display:none}
.dea-tech-report>summary:after{content:"⌄";font-size:20px;color:#83d8b4;transition:transform .22s}
.dea-tech-report[open]>summary:after{transform:rotate(180deg)}
.dea-tech-report-inner{padding:0 16px 17px}
.dea-tech-group{margin-top:20px;padding-top:12px;border-top:1px solid #31506a}
.dea-tech-group h4{margin:0 0 5px;font-size:11px;letter-spacing:.13em;color:#f1d498}
.dea-tech-scan-row{justify-content:flex-start}
.dea-tech-status{display:block;font-size:9px;letter-spacing:.06em;font-weight:850;color:#72e0b1;margin-top:3px}
.dea-tech-scan-row.is-doc .dea-tech-status{color:#a7cbef}
.dea-tech-scan-row.is-private .dea-tech-status,.dea-tech-scan-row.is-warn .dea-tech-status{color:#f1cb85}
.dea-tech-scan-row.is-doc .dea-tech-mark{background:#17334c;color:#9bccef;border-color:#4b769e}
.dea-tech-scan-row.is-private .dea-tech-mark,.dea-tech-scan-row.is-warn .dea-tech-mark{background:#392e1d;color:#f4ce87;border-color:#a88448}
.dea-tech-run{border-color:#70bc9e;background:#123c39}
.dea-tech-run:hover{background:#18574e}
.dea-tech-results-head{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-top:17px}
.dea-tech-ring{width:106px;height:106px;flex:none;border-radius:50%;padding:9px;display:grid;place-items:center;background:conic-gradient(#73ddb5 calc(var(--pct,0) * 1%),#25445d 0)}
.dea-tech-ring-inner{border-radius:50%;background:#081b2d;width:100%;height:100%;display:grid;place-items:center;text-align:center}
.dea-tech-ring-inner strong{font-size:22px;color:#e6fdf1;font-variant-numeric:tabular-nums}
.dea-tech-ring-inner small{font-size:9px;color:#a6bed0;display:block}
.dea-tech-score{flex:1;min-width:190px}
.dea-tech-score h3{margin:0 0 6px;font-size:15px;color:#eafdf2}
.dea-tech-score p{margin:3px 0;color:#b6cedc;font-size:11px;line-height:1.6}
.dea-tech-note strong{color:#f0cf90}
.dea-tech-economic{border-top:1px solid #3a576f;margin-top:15px;padding-top:15px}
.dea-tech-economic h4{font-size:13px;color:#ead6a1;margin:0 0 7px}
.dea-tech-economic p{font-size:12px;color:#e2edf4;line-height:1.75;margin:4px 0}
.dea-tech-economic small{font-size:10px;color:#acbfd0;line-height:1.7;display:block}
.dea-tech-foot{align-items:center}
.dea-tech-foot a{color:#e9cd8a;text-decoration:underline;text-underline-offset:3px}
.dea-tech-meta{font-size:10px!important;color:#93b1c6}
.dea-tech-module-caption{color:#b4c8d8;font-size:10px}
.dea-tech-scan-row .detail{font-size:10px}
.dea-tech-bar>div{background:linear-gradient(90deg,#3aa8db,#69ddb2,#e2c277)}
@media(max-width:630px){.dea-tech-report-inner{padding:0 10px 15px}.dea-tech-ring{width:88px;height:88px}.dea-tech-results-head{align-items:flex-start}.dea-tech-foot{flex-direction:column}.dea-tech-open{margin:8px 0 0!important}.dea-tech-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.dea-tech-report>summary:after{transition:none}}
/* Presentación homogénea verde; los detalles mantienen el alcance real de cada comprobación. */
#dea-tech-layer .dea-tech-mark,#dea-tech-layer .dea-tech-mark.pending{background:#163d37!important;color:#84e2b3!important;border-color:#4a9b78!important}
#dea-tech-layer .dea-tech-scan-row .dea-tech-status,#dea-tech-layer .dea-tech-scan-row.is-doc .dea-tech-status,#dea-tech-layer .dea-tech-scan-row.is-private .dea-tech-status,#dea-tech-layer .dea-tech-scan-row.is-warn .dea-tech-status{color:#72e0b1!important}
#dea-tech-layer .dea-tech-economic strong{color:#baf3cf}

.dea-tech-valuation-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:7px 0}.dea-tech-valuation-amount{font-weight:850;color:#baf3cf;font-size:clamp(16px,3vw,21px);font-variant-numeric:tabular-nums}.dea-tech-valuation-toggle{border:1px solid #a18a55;border-radius:8px;background:#273625;color:#f1d899;padding:7px 11px;font-size:12px;font-weight:800;cursor:pointer}.dea-tech-valuation-toggle:focus-visible{outline:2px solid #a9e5ca;outline-offset:2px}
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
    <article class="dea-tech-job"><span class="dea-tech-mark" aria-label="${status==="pending"?"Trabajo documentado, pendiente de validación privada":"Trabajo documentado"}">✓</span>
    <div><b>${name}</b><p>${desc}</p></div><span class="hours">${hours} h</span></article>`).join("");
  h(layer,`<div class="dea-tech-backdrop" data-dea-tech-close></div>
  <section class="dea-tech-modal" role="dialog" aria-modal="true" aria-labelledby="dea-tech-title" tabindex="-1">
    <header class="dea-tech-head">
      <div class="dea-tech-eyebrow">DEA HABBO ES · Powered by YourDesignGPT</div>
      <div class="dea-tech-title-line">
        <h2 class="dea-tech-title" id="dea-tech-title">DEA HABBO ES — SYSTEM CHECK V7</h2>
        <button type="button" class="dea-tech-close" aria-label="Cerrar diagnóstico" data-dea-tech-close>×</button>
      </div>
      <p class="dea-tech-sub">Technical Infrastructure &amp; Development Overview</p>
      <p class="dea-tech-meta">Developed by <a href="https://yourdesigngpt.vercel.app/" target="_blank" rel="noopener noreferrer">YourDesignGPT</a> · Demostración visual con comprobaciones públicas de solo lectura</p>
    </header>
    <div class="dea-tech-content">
      <div class="dea-tech-summary">
        <div class="dea-tech-metric"><strong>V7</strong><span>DEA HABBO ES</span></div>
        <div class="dea-tech-metric"><strong id="dea-tech-public-count">0</strong><span>Recursos públicos examinados</span></div>
        <div class="dea-tech-metric"><strong id="dea-tech-private-count">0</strong><span>Módulos con validación pendiente</span></div>
        <div class="dea-tech-metric"><strong>${HOURS} h</strong><span>Estimación comercial (no certificada)</span></div>
      </div>
      <div class="dea-tech-section"><h3>INITIALIZING SYSTEM SCAN...</h3><button type="button" class="dea-tech-run" id="dea-tech-run" disabled>↻ RUN SCAN AGAIN</button></div>
      <p class="dea-tech-hint">Presentación visual en verde de los módulos documentados. Solo se inspeccionan recursos públicos; los indicadores OK no certifican integraciones privadas ni seguridad. El 100 % mide el avance del recorrido.</p>
      <div class="dea-tech-bar" role="progressbar" aria-label="Progreso de inspección" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="dea-tech-bar"><div></div></div>
      <p class="dea-tech-progress-text" id="dea-tech-progress" aria-live="polite">Preparando inspección…</p>
      <div id="dea-tech-results"></div>
      <div class="dea-tech-results-head">
        <div id="dea-tech-ring" class="dea-tech-ring" style="--pct:0" aria-hidden="true"><div class="dea-tech-ring-inner"><div><strong id="dea-tech-percent">0%</strong><small>Review progress</small></div></div></div>
        <div class="dea-tech-score"><h3 id="dea-tech-outcome">SYSTEM SCAN INITIALIZING</h3><p>Public Components Reviewed · DEA HABBO ES · V7</p><p id="dea-tech-summary">Revisando componentes visibles. Las integraciones privadas solo se documentan.</p></div>
      </div>
      <p class="dea-tech-note"><strong>Alcance:</strong> esto es una demostración visual de inspección con comprobaciones de archivos públicos. No constituye auditoría externa, prueba de penetración ni validación de identidad, permisos Discord, Google Apps Script, Sheets o datos privados. Las funciones no publicadas y los rangos internos pendientes siguen sin certificarse.</p>
      <details class="dea-tech-report"><summary>PROJECT DEVELOPMENT REPORT</summary>
        <div class="dea-tech-report-inner">
          <p class="dea-tech-module-caption">Ficha de desarrollo y arquitectura del proyecto. Las horas reflejan una estimación comercial, no mediciones de trabajo real.</p>
          <div class="dea-tech-work">${tiles}</div>
          <div class="dea-tech-economic">
            <h4>Professional Development Valuation</h4>
            <p><strong>Horas estimadas:</strong> ${HOURS} h</p>
            <div class="dea-tech-valuation-row"><span>Valoración orientativa actual:</span><span class="dea-tech-valuation-amount" data-dea-value="current" data-value="${formatEuros(HOURS*ESTIMATED_RATE_CURRENT)}" aria-label="Importe oculto">•••••• €</span></div>
            <div class="dea-tech-valuation-row"><span>Escenario de proyecto validado:</span><span class="dea-tech-valuation-amount" data-dea-value="validated" data-value="${formatEuros(HOURS*ESTIMATED_RATE_VALIDATED)}" aria-label="Importe oculto">•••••• €</span></div>
            <button type="button" class="dea-tech-valuation-toggle" aria-pressed="false" aria-label="Mostrar valoración económica estimada" data-dea-valuation-toggle>👁 Ver valoración</button>
            <small>Importes ocultos por defecto; el botón permite verlos u ocultarlos. Cálculo ilustrativo: ${ESTIMATED_RATE_CURRENT} €/h actual y ${ESTIMATED_RATE_VALIDATED} €/h como escenario validado, aplicados a las horas estimadas del inventario, sin IVA. Estimación comercial orientativa. No es presupuesto aceptado, factura ni certificación de horas trabajadas. No se asignan precios individuales a módulos.</small>
          </div>
        </div>
      </details>
      <footer class="dea-tech-foot"><p><b>DEA HABBO ES · V7</b> · Desarrollo independiente de fans de Habbo Hotel. Sin afiliación con Habbo ni Sulake.</p>
        <p><b>Designed &amp; Developed by <a href="https://yourdesigngpt.vercel.app/" target="_blank" rel="noopener noreferrer">YourDesignGPT</a></b></p>
      </footer>
    </div>
  </section>`);
  document.body.append(layer);
  function hideValuation(){const btn=q("[data-dea-valuation-toggle]",layer);if(!btn)return;btn.setAttribute("aria-pressed","false");btn.setAttribute("aria-label","Mostrar valoración económica estimada");btn.textContent="👁 Ver valoración";layer.querySelectorAll("[data-dea-value]").forEach(el=>{el.textContent="•••••• €";el.setAttribute("aria-label","Importe oculto")})}
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
    row.className="dea-tech-scan-row is-"+result.state;
    const badge=document.createElement("span");
    badge.className="dea-tech-mark";
    badge.textContent="✓";
    const label=document.createElement("div");
    const strong=document.createElement("strong");strong.textContent=result.title;
    const status=document.createElement("span");status.className="dea-tech-status";status.textContent="OK · "+result.flag;
    const detail=document.createElement("span");detail.className="detail";detail.textContent=result.details;
    label.append(strong,status,detail);row.append(badge,label);results.append(row);
  }
  async function get(path,kind="text"){
    const url=new URL(path,document.baseURI);
    if(url.origin!==location.origin)throw Error("Recurso externo no inspeccionado");
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),6000);
    try{
      const response=await fetch(url.href,{cache:"no-store",signal:ctrl.signal});
      if(!response.ok)throw Error(`HTTP ${response.status}`);
      return kind==="check"?true:kind==="json"?response.json():response.text();
    }finally{clearTimeout(timer)}
  }
  const cache=new Map();
  const read=(file,kind="text")=>{
    const key=kind+":"+file;
    if(!cache.has(key))cache.set(key,get(file,kind));
    return cache.get(key);
  };
  const verified=(details,flag="MODULE DETECTED")=>({state:"ok",flag,details});
  const documented=(details)=>({state:"doc",flag:"CONFIGURED · DOCUMENTED",details});
  const pending=(details)=>({state:"private",flag:"PRIVATE VALIDATION REQUIRED",details});
  const inconclusive=(details)=>({state:"warn",flag:"CHECK INCONCLUSIVE",details});
  const hasAll=(value,needles)=>needles.every(v=>value.includes(v));
  const tasks=[
    ["FRONTEND & DESIGN",[
      ["HTML5 Structure",async()=>document.doctype?.name==="html"&&!!q("#app")?verified("Estructura HTML5 y contenedor de aplicación detectados.","CHECK COMPLETED"):inconclusive("No se encontró una estructura HTML5 reconocible.")],
      ["CSS3 Responsive Framework",async()=>{const s=await read("./styles.css");return hasAll(s,["@media",".choice","focus-visible"])?verified("CSS3, puntos de ruptura y estilos de foco encontrados.","INSTALLED"):inconclusive("No se encontraron todas las reglas responsive esperadas.");}],
      ["JavaScript Application",async()=>{const s=await read("./app.js");return hasAll(s,["function render()","function layoutHome()"])?verified("Motor de navegación app.js disponible y estructura detectada.","INSTALLED"):inconclusive("No se encontró la estructura pública esperada.");}],
      ["Navigation System",async()=>{const s=await read("./app.js");return hasAll(s,["ACCESO VIP","ÚNETE A DEA","WEB PÚBLICA"])?verified("Tres accesos originales y navegación SPA documentados.","MODULE DETECTED"):inconclusive("Revisar el código de navegación.");}],
      ["Corporate Visual Identity",async()=>{const x=await Promise.allSettled([read("./logo-dea-es.png","check"),read("./aguila-dea-original.jpg","check")]);const num=x.filter(a=>a.status==="fulfilled").length;return num===2?verified("Escudo y águila originales accesibles: 2/2.","CHECK COMPLETED"):inconclusive("Recursos visuales accesibles: "+num+"/2.");}],
      ["Mobile Compatibility",async()=>{const s=await read("./styles.css");return q('meta[name="viewport"]')&&s.includes("@media")?verified("Viewport y media queries presentes; prueba real en dispositivo no incluida.","CONFIGURED"):inconclusive("Faltan viewport o reglas de adaptación.");}]
    ]],
    ["WEB APPLICATION",[
      ["Public Information Portal",async()=>{const s=await read("./app.js");return hasAll(s,["publico/agencia","publico/jerarquia","publico/founders","publico/normativa"])?verified("Secciones institucionales y rutas declaradas.","MODULE DETECTED"):inconclusive("No se encontraron todas las secciones públicas.");}],
      ["R1–R10 Rank Structure",async()=>{const s=await read("./app.js");const total=Array.from({length:10},(_,i)=>"id:'R"+(i+1)+"'").filter(id=>s.includes(id)).length;return total===10?verified("Diez categorías detectadas; detalles internos R7–R10 aún por confirmar.","MODULE DETECTED"):inconclusive("Se detectaron "+total+" de las 10 categorías.");}],
      ["Promotion Rules",async()=>{const s=await read("./catalogo-publico.js");return hasAll(s,["Ascensos hasta R5 incluido","Ascensos hasta R7 incluido","Ascensos hasta R10 incluido"])?verified("Permisos acumulativos R5, R7 y R10 incluidos visibles; no verifica control privado.","CONFIGURED"):inconclusive("La normativa pública no coincide con la versión prevista.");}],
      ["Sala DEA, banderines y noticias",async()=>{const a=await read("./app.js");return hasAll(a,["publico/sala","publico/banderines","publico/noticias"])?documented("Rutas y vistas preparadas; sala y banderines aún sin contenido definitivo."):inconclusive("No se detectaron las tres rutas.");}],
      ["Benefit Badge Catalog",async()=>{const s=await read("./catalogo-publico.js");return s.includes("PLACAS_PUBLICAS")?documented("Catálogo y espacios de placas publicados; nombres, precios y beneficios sin aprobar."):inconclusive("No se detectó la estructura del catálogo.");}],
      ["Founder Access Launchers",async()=>{const files=["founder-10pedro.html","founder-kietsyandrea.html","founder-lesslie-ar.html","founder-xpe-34.html"];const x=await Promise.allSettled(files.map(v=>read("./"+v,"check")));const n=x.filter(y=>y.status==="fulfilled").length;return n===4?verified("Cuatro lanzadores públicos accesibles. No prueba permisos Founder.","CHECK COMPLETED"):inconclusive("Lanzadores accesibles: "+n+"/4.");}],
      ["Directors WebApp",async()=>await read("./directores-deawebapp.html","check")?documented("Lanzador de Directores disponible; la operación de ascensos R5 requiere validación privada."):inconclusive("No se encontró el lanzador.")],
      ["Managers WebApp",async()=>await read("./managers-deawebapp.html","check")?documented("Lanzador de Managers disponible; la operación de ascensos R7 requiere validación privada."):inconclusive("No se encontró el lanzador.")]
    ]],
    ["RADIO & VISITOR ANALYTICS",[
      ["DEA Radio Station · 11 stations",async()=>{const s=await read("./dea-radio.js");const names=["Zona Rap","LOS40 Urban","Tomorrowland One World Radio","Ibiza Global Radio","Cadena Dial"];return hasAll(s,names)&&s.includes("const stations=[")?verified("Reproductor y selección de emisoras presentes en el código; la señal externa depende de cada proveedor.","INSTALLED · 11 STATIONS"):inconclusive("No se detectó el catálogo esperado de emisoras.");}],
      ["Radio gated after password",async()=>{const s=await read("./dea-radio.js");return hasAll(s,["dea_v6_preview_admitted","mountRadio","MutationObserver"])?verified("La radio se monta tras la admisión de preinauguración.","ACCESS GATE INSTALLED"):inconclusive("No se detectó el control de montaje de la radio.");}],
      ["Compact radio UI",async()=>{const s=await read("./dea-radio.css");return hasAll(s,[".dr-dock",".dr-picker",".dr-expand"])?verified("Estilos del reproductor y selector de emisoras detectados.","RESPONSIVE INSTALLED"):inconclusive("Faltan reglas del reproductor.");}],
      ["DEA Visitor Counter",async()=>{const s=await read("./visitas.js");return hasAll(s,["function register()","data.total","data.hoy"])?verified("Registro de accesos y lectura de totales implementados; no se certifica disponibilidad del almacenamiento.","COUNTER INSTALLED"):inconclusive("No se detectó la integración del contador.");}],
      ["Visit History · 7/15/30/All",async()=>{const s=await read("./visitas.js");return hasAll(s,["data-period=","7 días","15 días","30 días","Todo"])?verified("Filtros de historial y gráfico diario/mensual detectados.","CHART INSTALLED"):inconclusive("No se detectaron todos los filtros.");}],
      ["Classified Visitor Counter",async()=>{const s=await read("./visitas.js");return hasAll(s,["dea-plate-classified","dea-classified-notice","dea_v6_preview_admitted"])?verified("Desenfoque de cifras y mensaje clasificado hasta superar la pantalla de acceso.","VISUAL GATE INSTALLED"):inconclusive("No se detectó la censura visual del contador.");}],
      ["Visit API",async()=>{const s=await read("./api/visitas.js");return hasAll(s,["createHandler","historial","PREFIX"])?verified("API de visitas e historial presente; comprobación de código, no auditoría del servicio.","API INSTALLED"):inconclusive("No se detectó la API esperada.");}]
    ]],
    ["INTEGRATIONS & DATABASE",[
      ["Discord OAuth2 Configuration",async()=>pending("Configuración indicada en documentación; no se verifica sesión, callback ni autorización OAuth2.")],
      ["Google Apps Script Connection",async()=>pending("Enlace de integración documentado; no se realiza petición a la implementación privada.")],
      ["Google Sheets Data Structure",async()=>pending("Estructura de hojas documentada; contenido y permisos no inspeccionados.")],
      ["Agent Records System",async()=>pending("El modelo de agentes requiere pruebas autenticadas de lectura, escritura y aislamiento.")],
      ["Promotion Management",async()=>pending("Exige pruebas con identidades reales: Director R5/R6, Manager R7/R8 y Founder R10.")],
      ["Payroll & Guardapaga",async()=>pending("Las nóminas y reservas Guardapaga requieren validación de operaciones en Apps Script.")],
      ["Audit Log Architecture",async()=>pending("Los registros y la trazabilidad requieren inspección autorizada del backend.")]
    ]],
    ["INFRASTRUCTURE",[
      ["GitHub Repository",async()=>documented("Repositorio público DEA-habbo-ES documentado; GitHub externo no consultado en esta revisión.")],
      ["Vercel Deployment",async()=>location.hostname.endsWith(".vercel.app")?verified("Página servida desde un hostname de Vercel; no equivale a prueba de todos los endpoints.","MODULE DETECTED"):documented("Despliegue en Vercel documentado; entorno actual no confirmado por dominio.")],
      ["GitHub Pages Backup",async()=>documented("Dirección de respaldo documentada; su disponibilidad externa no se ha comprobado.")],
      ["SEO Metadata",async()=>q('meta[name="robots"]')&&q('link[rel="canonical"]')?verified("Metadatos presentes; noindex conservado durante preinauguración.","CONFIGURED"):inconclusive("Faltan metadatos SEO esperados.")],
      ["PWA Manifest",async()=>{const m=await read("./site.webmanifest","json");return m?.name&&m?.icons?.length?verified("Manifiesto accesible e iconos definidos; no se certifica funcionamiento offline.","CHECK COMPLETED"):inconclusive("Manifiesto incompleto.");}],
      ["Website Resource Integrity",async()=>{const files=["./app.js","./catalogo-publico.js","./styles.css","./logo-dea-es.png"];const x=await Promise.allSettled(files.map(f=>read(f,"check")));const n=x.filter(y=>y.status==="fulfilled").length;return n===4?verified("Comprobación HTTP satisfactoria de "+n+"/4 recursos públicos.","CHECK COMPLETED"):inconclusive("Recursos HTTP accesibles: "+n+"/4.");}]
    ]]
  ];
  const queue=tasks.flatMap(([group,items])=>items.map(([title,fn])=>({group,title,fn})));
  let runId=0;
  async function scan(){
    const myId=++runId;
    cache.clear();
    runBtn.disabled=true;
    results.replaceChildren();
    barline.style.width="0%";bar.setAttribute("aria-valuenow","0");
    q("#dea-tech-ring",layer).style.setProperty("--pct","0");
    q("#dea-tech-percent",layer).textContent="0%";
    q("#dea-tech-outcome",layer).textContent="INITIALIZING SYSTEM SCAN...";
    q("#dea-tech-summary",layer).textContent="Inspeccionando únicamente recursos públicos de este sitio.";
    let checked=0, documentedCount=0, pendingCount=0, errors=0, lastGroup="";
    for(let i=0;i<queue.length;i++){
      if(myId!==runId)return;
      const {group,title,fn}=queue[i];
      if(group!==lastGroup){
        const section=document.createElement("div");section.className="dea-tech-group";
        const heading=document.createElement("h4");heading.textContent=group;
        section.append(heading);results.append(section);lastGroup=group;
      }
      progress.textContent="INITIALIZING SYSTEM SCAN... "+(i+1)+"/"+queue.length+" · "+title;
      let result;
      try{result=await fn()}catch(e){result=inconclusive("No se pudo comprobar desde el navegador: "+(e?.message||"error de red"));}
      if(myId!==runId)return;
      entry({title,...result});
      if(result.state==="ok")checked++;
      else if(result.state==="doc")documentedCount++;
      else if(result.state==="private")pendingCount++;
      else errors++;
      const pct=Math.round((i+1)*100/queue.length);
      barline.style.width=pct+"%";
      bar.setAttribute("aria-valuenow",String(pct));
      q("#dea-tech-ring",layer).style.setProperty("--pct",String(pct));
      q("#dea-tech-percent",layer).textContent=pct+"%";
      await new Promise(resolve=>setTimeout(resolve,125));
    }
    if(myId!==runId)return;
    const reviewed=checked+documentedCount+errors;
    q("#dea-tech-public-count",layer).textContent=String(reviewed);
    q("#dea-tech-private-count",layer).textContent=String(pendingCount);
    q("#dea-tech-outcome",layer).textContent="SYSTEM REVIEW COMPLETED";
    q("#dea-tech-summary",layer).textContent=reviewed+" componentes no privados examinados: "+checked+" detectados, "+documentedCount+" documentados y "+errors+" inconclusos. "+pendingCount+" requieren validación privada. El 100 % es solo el avance del recorrido.";
    progress.textContent="CHECK COMPLETED · "+queue.length+" módulos recorridos · "+pendingCount+" requieren validación privada.";
    runBtn.disabled=false;
  }
  let oldOverflow="";
  function show(){
    if(!layer.hidden)return;
    returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;document.body.style.overflow="hidden";
    hideValuation();layer.hidden=false;modal.focus();void scan();
  }
  function close(){
    runId++;runBtn.disabled=false;hideValuation();layer.hidden=true;document.body.style.overflow=oldOverflow;
    if(returnFocus?.isConnected)returnFocus.focus();
  }
  layer.addEventListener("click",e=>{
    if(e.target.closest("[data-dea-tech-close]"))close();
    else if(e.target.closest("#dea-tech-run"))void scan();
    else if(e.target.closest("[data-dea-valuation-toggle]")){const btn=q("[data-dea-valuation-toggle]",layer);const reveal=btn.getAttribute("aria-pressed")!=="true";btn.setAttribute("aria-pressed",String(reveal));btn.setAttribute("aria-label",reveal?"Ocultar valoración económica estimada":"Mostrar valoración económica estimada");btn.textContent=reveal?"◉ Ocultar valoración":"👁 Ver valoración";layer.querySelectorAll("[data-dea-value]").forEach(el=>{el.textContent=reveal?el.dataset.value:"•••••• €";el.setAttribute("aria-label",reveal?el.dataset.value:"Importe oculto")})}
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
    // La pantalla de contraseña de preinauguración jamás recibe el botón.
    for(const foot of document.querySelectorAll("#app .home-foot,#app .foot")){
      if(foot.querySelector(".dea-tech-open"))continue;
      const button=document.createElement("button");
      button.type="button";button.className="dea-tech-open";
      button.textContent="◉ WEB CHECK SCAN";
      button.setAttribute("aria-label","Abrir WEB CHECK SCAN V7");
      button.setAttribute("aria-haspopup","dialog");
      button.addEventListener("click",show);
      // Integración discreta junto al copyright, antes de los avisos legales.
      const credits=foot.querySelector(".dea-credit-main");
      (credits||foot).append(button);
    }
  }
  decorateFooter();
  const root=document.getElementById("app");
  if(root)new MutationObserver(decorateFooter).observe(root,{childList:true,subtree:false});
})();
