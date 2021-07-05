const form = document.querySelector('form');
// offline data
// firestore ja lida sozinho em persistir data no indexedDB do browser
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // pode ser por conta muitas abas abertas juntas
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      //o browser nao suporta
      console.log('persistance not available');
    }
  });


// real-time listener, sempre tiver uma mudança no db ele manda um snapshot
db.collection('recipes').onSnapshot(snapshot => {
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    //console.log(change.type, change.doc.id, change.doc.data());
    if(change.type === 'added'){
      // add a receita
      renderRecipe(change.doc.data(), change.doc.id);
      firebase.database().ref('Imagens/'+change.doc.id).on('value' , function(snapshot){//busca a imagem no RealtimeDatabase
        AddImagem(change.doc.id , snapshot.val().Link)//carrega a imagem da receita renderizada , passando o id da receita e o link da imagem 
      });
    }
    if(change.type === 'removed'){
      // remove a receita
      removeRecipe(change.doc.id);
    }
  });
});

// add uma receita
form.addEventListener('submit', evt => {
  evt.preventDefault();
  
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
    preparo: form.textarea1.value,
  };

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err));
  
  //esvazia os inputs
  form.title.value = '';
  form.ingredients.value = '';
  form.textarea1.value = '';
});

// remove uma receita
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  //se clicou no icone de lixin
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('recipes').doc(id).delete();
  }
})

//Evento que ocorre quando esta segurando a imagem sobre a area de upload
recipeContainer.addEventListener('dragover', evt => {
  if(evt.target.classList.contains('ilustrate')){//verifica se esta segurando a imagem sobre da area de upload
    evt.preventDefault();
    evt.stopPropagation();
    if (!(isMobileDevice())) {
      evt.target.classList.add('upload-img-border');//ativa borda
      evt.target.classList.remove('upload-img');//desativa borda 
    }
  }
}, false)

//Evento que ocorre quando esta segurando a imagem fora da area de upload
recipeContainer.addEventListener('dragleave', evt => {
  if(evt.target.classList.contains('ilustrate')){//verifica se esta segurando a imagem sobre da area de upload
    evt.preventDefault();
    evt.stopPropagation();
    if (!(isMobileDevice())) {
      evt.target.classList.add('upload-img');//desativa borda 
      evt.target.classList.remove('upload-img-border');//ativa borda
    }
  }
}, false)

//Quando solta a imagem na area para upload
recipeContainer.addEventListener('drop', evt => {
  if(evt.target.classList.contains('ilustrate')){//verifica se esta segurando a imagem sobre da area de upload
    evt.preventDefault();
    evt.stopPropagation();
    if (!(isMobileDevice())) {
      evt.target.classList.remove('upload-img-border');//ativa borda
      evt.target.classList.add('upload-img');//desativa borda 

      var files = evt.dataTransfer.files; // obtem a imagem
      var reader = new FileReader(); 
      reader.onload = function(){
        evt.target.src = reader.result; //alterar a src da imagem selecionada para imagem carregada
      }
      reader.readAsDataURL(files[0]);
      const id = evt.target.getAttribute('data-id');//pega o id para poder definir a que receita a imagem pertence na hora de salvar no banco

      var ImgUrl;
      var uploadImage = firebase.storage().ref('Imagens/' + id + ".png").put(files[0]); //salva imagem no storage
      uploadImage.on('state_changed' , function(snapshot){
        
      },
        function(error){
          console.log("Erro ao salvar imagem !!!")
        },
        function(){
          uploadImage.snapshot.ref.getDownloadURL().then(function(url){//apos a imagem ser salva no storage , pegamos o link dela
            ImgUrl = url;
            firebase.database().ref('Imagens/'+id).set({//salva o link da imagem e o id da receita que ela pertence no RealtimeDatabase
              IdImage: id,
              Link: ImgUrl
            });
            console.log("Imagem Salva !");
          });
        }
      );
    }
  }
}, false)

