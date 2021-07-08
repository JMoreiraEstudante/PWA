//checa se o browser suporta serviceworker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err));
}

//checa browser tem suporte file API para compressao das foto
if ( window.File && window.FileReader && window.FileList && window.Blob ) console.log('The File APIs are fully supported in this browser.')
else console.log('The File APIs are not fully supported in this browser.'); 