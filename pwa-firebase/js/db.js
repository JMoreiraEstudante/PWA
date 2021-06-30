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
    }
    if(change.type === 'removed'){
      // remove a receita
      removeRecipe(change.doc.id);
    }
  });
});

const form = document.querySelector('form');

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