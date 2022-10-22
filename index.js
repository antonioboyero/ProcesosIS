// [START gae_flex_quickstart]


const fs = require("fs");
const express = require('express');
const app = express();
const modelo = require("./servidor/modelo.js")

// Start the server
const PORT = process.env.PORT || 3000;

let juego = new modelo.Juego();

//http get post put delete
/*
get "/"
get "/Obtener Partidas"
post get "/agregarUsuario/:nick"
put "/actualizarPartida"
delete "/eliminarPartida"
...
*/

app.use(express.static(__dirname + "/"));

app.get("/", function(request,response){
  var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
  response.setHeader("Content-type","text/html");
  response.send(contenido);
});

app.get("/agregarUsuario/:nick",function(request,response){
  let nick = request.params.nick;
  let res = juego.agregarUsuario(nick);
  response.send(res);
});

app.get("/crearPartida/:nick",function(request,response){
  let nick = request.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  // let usr = juego.usuarios[nick]; //juego.obtenerUsuario(nick)
  // let res={codigo:-1};

  // if(usr){
  //   codigo=usr.crearPartida();
  //   res={codigo:codigo};
  // }
  response.send(res);
});

app.get("/unirseAPartida/:nick/:codigo",function(request,response){
  let nick = request.params.nick;
  let codigo = request.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick,codigo);
  response.send(res);
});

app.get("/obtenerPartidas",function(request,response){
  let lista = juego.obtenerPartidas();
  response.send(lista);
});

app.get("/obtenerPartidasDisponibles",function(request,response){
  //error calcular bien
  let lista = juego.obtenerPartidas();
  response.send(lista);
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]