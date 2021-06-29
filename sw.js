const staticCacheName = 'site-static-v1';
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
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
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
        .filter(key => key !== staticCacheName)//filtra cache atual
        .map(key => caches.delete(key))//delete em todos os outros
      );
    })
  );
});

// fetch event ao server sobre todos os recursos que o app usa
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  //para fetch event e procura no cache
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request); //caso n ache no cache continua o fetch event
    })
  );  
});