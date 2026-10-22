// Service worker do Carrodle: deixa o jogo abrir mesmo sem internet.
// Rede primeiro (a página e os dados dos carros ficam sempre atualizados); se estiver sem internet, usa a cópia guardada.
const V="carrodle-v1";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 if(new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r})
  .catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
