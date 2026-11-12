import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./integraciones/apps-script/registro-discord.gs',import.meta.url),'utf8');
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
