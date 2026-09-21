/* Service worker do Treino.
   Torna a pagina instalavel como app e a deixa funcionar sem internet.

   Estrategia (v2): a PAGINA vem da rede primeiro, com 3,5 s de paciencia;
   se a rede demorar ou faltar, cai para a copia local. Assim, com sinal
   voce sempre ve a versao publicada, e sem sinal o treino abre igual.
   Os arquivos fixos (icones, manifest) continuam vindo do cache primeiro.

   A v1 respondia tudo do cache e so atualizava depois, o que fazia uma
   versao nova demorar varias aberturas para aparecer.
   Ao mudar algo importante aqui, troque o numero de CACHE. */
var CACHE = "treino-v2";
var ARQUIVOS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"
];
var ESPERA = 3500;

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

/* documento: rede primeiro, cache como rede reserva */
function redePrimeiro(req, c) {
  return new Promise(function (resolve) {
    var respondido = false;
    function entregar(r) { if (!respondido && r) { respondido = true; resolve(r); } }

    var relogio = setTimeout(function () {
      c.match(req, { ignoreSearch: true }).then(entregar);
    }, ESPERA);

    fetch(req.url, { cache: "no-store", credentials: "same-origin" })
      .then(function (res) {
        clearTimeout(relogio);
        if (res && res.ok) c.put(req.url, res.clone());   /* guarda para o modo offline */
        entregar(res);
      })
      .catch(function () {
        clearTimeout(relogio);
        c.match(req, { ignoreSearch: true }).then(function (hit) {
          entregar(hit || new Response("Sem conexão e sem cópia local.", {
            status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
          }));
        });
      });
  });
}

/* arquivos fixos: cache primeiro, atualizando por tras */
function cachePrimeiro(req, c) {
  return c.match(req, { ignoreSearch: true }).then(function (hit) {
    var rede = fetch(req).then(function (res) {
      if (res && res.ok) c.put(req, res.clone());
      return res;
    }).catch(function () { return hit; });
    return hit || rede;
  });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  var ehPagina = e.request.mode === "navigate"
    || e.request.destination === "document"
    || /\.html$/.test(url.pathname)
    || url.pathname.slice(-1) === "/";
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return ehPagina ? redePrimeiro(e.request, c) : cachePrimeiro(e.request, c);
    })
  );
});
