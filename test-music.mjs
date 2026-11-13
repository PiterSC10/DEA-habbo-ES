import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
test('Music uses the provided official playlist and publishes a page without a competing radio',async()=>{
 const html=await read('musica/index.html');
 assert.match(html,/https:\/\/open\.spotify\.com\/embed\/playlist\/0eBQBwQuJU7YtfSDEReIIS\?/);
 assert.match(html,/title="Playlist de Spotify · DEA Music"/);assert.doesNotMatch(html,/src="[^\"]*dea-radio|autoplay=1/);
 const app=await read('app.js');assert.match(app,/path==='publico\/musica'\?'\/musica\/'/);assert.match(app,/deaMusicTeaser\(\)/);
});
test('Music copies the short URL, stops Spotify on leave and restores it on back navigation',async()=>{
 const handlers={},button={},status={textContent:''},source='https://open.spotify.com/embed/playlist/0eBQBwQuJU7YtfSDEReIIS',frame={src:source,getAttribute:()=>source};let copied;
 button.addEventListener=(name,fn)=>handlers[name]=fn;
 runInNewContext(await read('musica/music.js'),{navigator:{clipboard:{writeText:async s=>copied=s}},document:{getElementById:id=>id==='music-share'?button:status,querySelector:()=>frame},window:{addEventListener:(n,fn)=>handlers[n]=fn}});
 await handlers.click();assert.equal(copied,'https://agenciaoficialdea.es/musica');assert.match(status.textContent,/copiado/);
 handlers.pagehide();assert.equal(frame.src,'about:blank');handlers.pageshow({persisted:true});assert.equal(frame.src,source);
});
test('Unavailable clipboard gives a usable link and old radio is stopped when navigating away',async()=>{
 const button={},status={textContent:''};let click;
 button.addEventListener=(_,fn)=>click=fn;
 runInNewContext(await read('musica/music.js'),{navigator:{},document:{getElementById:id=>id==='music-share'?button:status,querySelector:()=>null},window:{addEventListener(){}}});
 await click();assert.match(status.textContent,/https:\/\/agenciaoficialdea.es\/musica/);
 assert.match(await read('dea-radio.js'),/window\.addEventListener\('pagehide',stop\)/);
});
