import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const calc=readFileSync(new URL('./calculadora/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const plaques=readFileSync(new URL('./catalogo-publico.js',import.meta.url),'utf8');
const faq=readFileSync(new URL('./faq-dea/index.html',import.meta.url),'utf8');
const i=calc.indexOf('const groups=');
const j=calc.indexOf(';\n\nconst plates=',i);
assert.ok(i>=0&&j>i,'Datos de rangos localizados');
const groups=JSON.parse(calc.slice(i+'const groups='.length,j));
const mStart=calc.indexOf('function model(){');
const mEnd=calc.indexOf('\nconst roleFunctions=',mStart);
assert.ok(mStart>0&&mEnd>mStart,'Modelo de cálculo localizado');
const modelCode=calc.slice(mStart,mEnd);
function simulate(index,chosen=[]){
 const env={rank:{value:String(index)},role:{value:'0'},groups,active:id=>chosen.includes(id)};
 return runInNewContext(modelCode+';model()',env);
}
test('Sin RN: bono normal de 3 c después de 2 h extra',()=>{
 const r=simulate(1);
 assert.equal(r.g.pay,9);
 assert.equal(r.hours,3);
 assert.equal(r.bonus,3);
 assert.equal(r.extraHours,2);
 assert.equal(r.hours+r.extraHours,5);
});
test('RN: bonificación de 3 c después de 1 h 30 extra, más nómina ordinaria al 50 %',()=>{
 const r=simulate(1,['rn']);
 assert.equal(r.reduced,true);
 assert.equal(r.hours,1.5);
 assert.equal(r.extraHours,1.5);
 assert.equal(r.bonus,3);
 assert.equal(r.hours+r.extraHours,3);
 assert.equal((r.hours+r.extraHours)*2,6);
 assert.equal(r.g.pay*2+r.bonus*2,24);
});
test('Gold incluye RN, las dos placas no acumulan reducciones',()=>{
 for(const selection of [['gold'],['rn','gold']]){
  const r=simulate(1,selection);
  assert.equal(r.hours,1.5);
  assert.equal(r.extraHours,1.5);
  assert.equal(r.bonus,3);
 }
});
test('La nueva condición funciona en otros rangos y no añade bonificación a R8',()=>{
 const supervisor=simulate(4,['rn']);
 assert.equal(supervisor.hours,4);
 assert.equal(supervisor.extraHours,1.5);
 assert.equal(supervisor.bonus,3);
 const secretary=simulate(7,['rn']);
 assert.equal(secretary.bonus,0);
 assert.equal(secretary.extraHours,0);
});
test('La web publica coherentemente las horas de RN y Gold',()=>{
 for(const source of [calc,app,plaques,faq]){
  assert.ok(source.includes('1 hora y 30 minutos'), 'Falta nueva duración en una fuente');
 }
 assert.ok(calc.includes('num(m.extraHours)'),'Las horas adicionales deben calcularse, no fijarse a 2 h');
 assert.ok(calc.includes('m.hours+m.extraHours'),'El total de horas debe tener en cuenta RN');
 assert.ok(plaques.includes("Reducción de Nómina [RN]"));
});
