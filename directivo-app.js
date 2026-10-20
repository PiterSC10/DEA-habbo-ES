/* DEA · dos accesos de gestión por cargo. La identidad NO se asigna en el navegador. */
'use strict';
(()=>{
 const root=document.querySelector('[data-dea-directivo]');
 if(!root)return;
 const role=root.getAttribute('data-dea-directivo');
 const conf={director:{name:'DIRECTORES',max:5,app:'d-directores'},manager:{name:'MANAGERS',max:7,app:'m-managers'}}[role];
 if(!conf)return;
 const url='https://script.google.com/macros/s/AKfycbyhGqAW8AiwHt11JBT3jmf2In5do2MRpO-H_urxftlewpJgvmWdQV3mrbQQdtOnYndNEg/exec?app='+encodeURIComponent(conf.app);
 const access=document.getElementById('dea-directivo-login');
 if(access){access.href=url;access.rel='noreferrer noopener';}
 document.title='DEA CONTROL APP '+conf.name+' · Discord';
})();
