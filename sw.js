const staticCacheName = 'site-static-v19';
const dynamicCacheName = 'site-dynamic-v12';
//todos os assets que compoe a camada principal no app (shell assets)
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html',
];

// install event acontece sempre arquivo sw.js muda
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  //constroi cache dos shell assets
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    //apagando cache antigo
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)//filtra caches atuais
        .map(key => caches.delete(key))//delete em todos os outros
      );
    })
  );
});

// fetch event ao server sobre todos os recursos que o app usa
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  //ignora fetch event sobre data do db
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    //para fetch event e procura no cache
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request) //caso nao ache nos caches, fetch event continua
          .then(fetchRes => {
              //constroi o cache dinamico
              return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
          })
        });
      }).catch(() => { //caso o fetch event falhe, ai mostra a pagina de fallback
        if(evt.request.url.indexOf('.html') > -1){//caso ocorra request por uma pag html
          return caches.match('/pages/fallback.html');
        } 
      })
    );
  }
});