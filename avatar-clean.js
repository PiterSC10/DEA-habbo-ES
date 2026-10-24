/* DEA: remove uniform baked-in background from approved pixel avatars at display time. */
(()=>{
 'use strict';
 const names=['founder-xpe34.png','manager-fr4nn23.png'];
 function clean(img){
  if(img.dataset.deaCleaned)return;
  if(!names.some(n=>(img.getAttribute('src')||'').includes(n)))return;
  if(!img.complete||!img.naturalWidth)return;
  img.dataset.deaCleaned='1';
  try{
   const w=img.naturalWidth,h=img.naturalHeight;
   const c=document.createElement('canvas');c.width=w;c.height=h;
   const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
   const image=ctx.getImageData(0,0,w,h),d=image.data;
   const corners=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]].map(([x,y])=>(y*w+x)*4);
   const opaque=corners.filter(i=>d[i+3]>200);
   if(!opaque.length)return;
   const bg=[0,1,2].map(k=>opaque.reduce((sum,i)=>sum+d[i+k],0)/opaque.length);
   const diff=i=>Math.max(Math.abs(d[i]-bg[0]),Math.abs(d[i+1]-bg[1]),Math.abs(d[i+2]-bg[2]));
   const visited=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
   function add(p){if(p<0||p>=w*h||visited[p])return;visited[p]=1;const i=p*4;if(d[i+3]<30||diff(i)<40)queue[tail++]=p;}
   for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}
   for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
   let removed=0;
   while(head<tail){const p=queue[head++],i=p*4;if(d[i+3]){d[i+3]=0;removed++}const x=p%w;if(x>0)add(p-1);if(x<w-1)add(p+1);if(p>=w)add(p-w);if(p<w*(h-1))add(p+w)}
   if(removed<Math.max(10,w*h*.025))return;
   ctx.putImageData(image,0,0);img.src=c.toDataURL('image/png');
  }catch(e){img.dataset.deaCleaned='error';}
 }
 function scan(){document.querySelectorAll('img').forEach(img=>{if(img.complete)clean(img);else if(!img.dataset.deaCleanPending){img.dataset.deaCleanPending='1';img.addEventListener('load',()=>clean(img),{once:true})}})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
 new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();
