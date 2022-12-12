const fs = require('fs');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require("./servidor/modelo.js");
const sWS = require("./servidor/servidorWS.js");
const PORT = process.env.PORT || 5000;
var args = process.argv.slice(2);

//passport
const passport = require('passport');

let juego = new modelo.Juego(args[0]);
let servidorWS = new sWS.ServidorWS();


app.use(express.static(__dirname + "/"));


app.get("/", function (request, response) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
//auth/github etc
//asi se podría ir haciendo


app.get("/agregarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let res;
  res = juego.agregarUsuario(nick);
  response.send(res);
});


app.get("/comprobarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let us = juego.obtenerUsuario(nick);
  let res = { "nick": -1 };
  if (us) {
    res.nick = us.nick;
  }
  response.send(res);
})


app.get("/crearPartida/:nick", function (request, response) {
  let nick = request.params.nick;
  let res = juego.jugadorCreaPartida(nick);

  response.send(res);
});


app.get("/unirseAPartida/:nick/:codigo", function (request, response) {
  let nick = request.params.nick;
  let codigo = request.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick, codigo)
  response.send(res);
})


app.get("/obtenerPartidas", function (request, response) {
  let lista = juego.obtenerPartidas();
  response.send(lista);
})


app.get("/obtenerPartidasDisponibles", function (request, response) {
  let lista = juego.obtenerPartidasDisponibles();
  response.send(lista);
})


app.get("/salir/:nick", function (request, response) {
  let nick = request.params.nick;
  cod = juego.usuarioSale(nick);
  response.send({ res: "ok", codigo: cod });
});


app.get("/obtenerLogs", function (request, response) {
  juego.obtenerLogs(function (logs) {
    response.send(logs);
  })
});


server.listen(PORT, () => {
  console.log(`App a la escucha del puerto ${PORT}`);
  console.log('Press Ctrl+C para salir.');
});


//lanzar el servidorWs
servidorWS.lanzarServidorWS(io, juego);