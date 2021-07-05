//checa se o browser suporta serviceworker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err));
}

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) 
  console.log("Tem suporte pra câmera")
else  
  console.log("Não tem suporte pra câmera")