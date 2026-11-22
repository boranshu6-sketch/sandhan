/* Sandhan service worker: offline app shell, fresh notices, background check */
const VERSION="sandhan-v3-2026-11-22";
const SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET")return;
  if(u.pathname.endsWith("/notices.json")){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put("./notices.json",cp));return r}).catch(()=>caches.match("./notices.json")));return}
  if(u.origin===location.origin){
    if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put("./index.html",cp));return r}).catch(()=>caches.match("./index.html")));return}
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}return r})))}
});
async function backgroundCheck(){
  try{
    const r=await fetch("./notices.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)return;
    const d=await r.clone().json(),list=Array.isArray(d)?d:d.notices;if(!Array.isArray(list))return;
    const c=await caches.open(VERSION);const kr=await c.match("./__known");const known=new Set(kr?await kr.json():[]);
    await c.put("./notices.json",r);
    const today=new Date().toISOString().slice(0,10);
    const fresh=known.size?list.filter(j=>j&&j.id&&!known.has(j.id)&&(!j.lastDate||j.lastDate>=today)):[];
    await c.put("./__known",new Response(JSON.stringify(list.map(j=>j.id))));
    if(fresh.length)await self.registration.showNotification(fresh.length===1?fresh[0].title:`${fresh.length} new notices on Sandhan`,{body:fresh.length===1?`${fresh[0].org||""}${fresh[0].lastDate?" · Last date "+fresh[0].lastDate:""}`:fresh.slice(0,3).map(j=>j.title).join(" · "),icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"sandhan-new",data:{url:fresh.length===1?"./#job-"+fresh[0].id:"./#jobs"}});
  }catch(e){}
}
self.addEventListener("periodicsync",e=>{if(e.tag==="sandhan-refresh")e.waitUntil(backgroundCheck())});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus" in c){c.navigate(url);return c.focus()}}return self.clients.openWindow(url)}))});
