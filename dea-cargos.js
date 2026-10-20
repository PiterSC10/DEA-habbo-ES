/* DEA V6 · Lanzadores de cargo: NUNCA autentican ni dan permisos en cliente. */
'use strict';
(()=>{
 const root=document.querySelector('[data-dea-role]');
 if(!root)return;
 const role=root.getAttribute('data-dea-role');
 if(!['director','manager'].includes(role))return;
 const link=document.getElementById('dea-role-enter');
 const base='https://script.google.com/macros/s/AKfycbyhGqAW8AiwHt11JBT3jmf2In5do2MRpO-H_urxftlewpJgvmWdQV3mrbQQdtOnYndNEg/exec';
 // El rol se indica como contexto de navegación, NUNCA como autorización.
 // Apps Script deberá validar el Discord ID y el cargo real desde sus hojas privadas.
 const app=role==='director'?'d-directores':'m-managers';
 link.href=base+'?start=direct&app='+encodeURIComponent(app);
 link.setAttribute('aria-label','Continuar con Discord al panel '+(role==='director'?'de Directores':'de Managers'));
})();