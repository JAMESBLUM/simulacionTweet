// VARIABLES
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets = [];

// EVENTOS
eventListeners();
function eventListeners(){
    //cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //cuando el documento esta listo
    document.addEventListener('DOMContentLoaded',()=>{
        tweets = JSON.parse(localStorage.getItem('tweets') || []); // || Intenta buscar en localStorage y si no los encuentra los asigna como un objeto vacio
        crearHTML();
    });
}

// FUNCIONES
function agregarTweet(e){
    e.preventDefault();
    // Textarea donde el usuario escribe el tweet
    const tweet = document.querySelector('#tweet').value;
    //Validación
    if(tweet === ''){
        mostrarError('Un mensaje no puede ir vacio');
        return; //Evita que se ejecuten mas lineas de codigo (Solo funciona cuando un if esta dentro de una funcion)
    }
    const tweetObj ={
        id: Date.now(), //Nos va a servir como identificador para que no se repita el contenido
        tweet,
    }
    //Agregar al arreglo de tweets
    tweets = [...tweets, tweetObj];
    //UNA VEZ AGREGADO VAMOS A CREAR EL HTML
    crearHTML();
    
    //Resetea el formulario
    formulario.reset();
}

// Mostrar mensaje de error
function mostrarError(error){
    const mensajeError = document.createElement('P');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    //EVITAR QUE SE MUESTREN MULTIPLES MENSAJES DE ERROR
    const errores = document.querySelectorAll('.error');
    if(errores.length === 0){
        //INSERTAMOS EN EL CONTENIDO
        const contenido = document.querySelector('#contenido');
        contenido.appendChild(mensajeError);
    }
    //Elimina la alerta despues de 3s
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}
//CREA UN LISTADO DE LOS TWEETS
function crearHTML(){
    limpiarHtml();
    if(tweets.length > 0){
        tweets.forEach( tweet =>{
            //Agregar un boton para eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';
            //Añadir la función de eliminar
            btnEliminar.onclick =()=>{
                borrarTweet(tweet.id);
            }
            //Creamos el html
            const li = document.createElement('LI');
            //Añadir el texto
            li.innerText = tweet.tweet;
            //Asignar el boton 
            li.appendChild(btnEliminar);
            //Insertamos en el html
            listaTweets.appendChild(li);
        });
    }
    //sincronizacion de localStorage
    sincronizarLocalStorage();
}

//Si detecta elementos eliminara el primer elemento hijo que encuentre
function limpiarHtml(){
    while(listaTweets.firstChild){
        listaTweets.removeChild(listaTweets.firstChild);
    }
}
//Agrega los tweets al localStorage
function sincronizarLocalStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweets));
}
//Elimina el tweet 
function borrarTweet(id){
    tweets = tweets.filter(tweet => tweet.id !== id);
    crearHTML();
}