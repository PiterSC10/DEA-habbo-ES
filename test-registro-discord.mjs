import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./integraciones/apps-script/registro-discord.gs',import.meta.url),'utf8');
test('Direct OAuth preserves a validated miniapp and rejects unknown destinations',()=>{
 let claim;
 const context=vm.createContext({deaFounderApp_:x=>x==='founder',deaCargoApp_:x=>x==='m-managers',deaBeginLogin:x=>{claim=x;return 'https://discord.com/oauth2/authorize';},deaRebindEscape_:x=>x,HtmlService:{createHtmlOutput:x=>x}});
 vm.runInContext(readFileSync(new URL('./integraciones/apps-script/entrada-discord.gs',import.meta.url),'utf8'),context);
 context.deaDirectLogin_('m-managers');assert.equal(claim.app,'m-managers');assert.equal(claim.remember,true);
 context.deaDirectLogin_('founder');assert.equal(claim.app,'founder');
 assert.throws(()=>context.deaDirectLogin_('untrusted'),/Miniapp no disponible/);
});
test('OAuth registry is idempotent and never grants a role',()=>{
 const rows=[['discord_id','discord_usuario','fecha_alta_utc','origen']],audits=[];
 const sheet={getRange:()=>({getDisplayValues:()=>[rows[0]]}),getDataRange:()=>({getDisplayValues:()=>rows}),appendRow:r=>rows.push(r)};
 const context=vm.createContext({deaBook_:()=>({getSheetByName:()=>sheet}),deaNow_:()=>new Date().toISOString(),deaClean_:x=>x,deaAudit_:(...x)=>audits.push(x)});
 vm.runInContext(source,context);
 const account={id:'123456789012345678',username:'test'};
 context.deaRegistryEnsure_(account);context.deaRegistryEnsure_(account);
 assert.equal(rows.length,2);assert.equal(audits.length,1);assert.equal(rows[1].length,4);
 assert.throws(()=>context.deaRegistryEnsure_({id:'unverified'}),/Discord no verificado/);
});
test('Registry history rejects missing authorization before reading private data',()=>{
 let read=false;
 const context=vm.createContext({deaRequire_:()=>{throw Error('denied');},deaObjects_:()=>{read=true;return [];}});
 vm.runInContext(source,context);
 assert.throws(()=>context.deaRegistroHistorial('',0),/denied/);assert.equal(read,false);
});
