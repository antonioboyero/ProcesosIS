function ServidorWS() {


    //enviar peticiones
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }
    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos);
    }
    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }





    //gestionar peticiones
    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            console.log('Usuario conectado');


            //CREAR PARTIDA
            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io, codigoStr, "partidaCreada", res)
                let lista = juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });


            //UNIRSE A PARTIDA
            socket.on("unirseAPartida", function (nick, codigo) {
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                let partida = juego.obtenerPartida(codigo);
                if (partida.esDesplegando()) {
                    let us = juego.obtenerUsuario(nick);
                    let flota = us.obtenerFlota();
                    let res = {};
                    res.flota = flota;
                    cli.enviarATodosEnPartida(io, codigoStr, "faseDesplegando", res);
                }

            });


            //USUARIO SALE
            socket.on("usuarioSale", function (nick, codigo) {
                let lista = juego.obtenerPartidasDisponibles();

                res = { jugadorS: nick }
                if (codigo) {
                    let codigoStr = codigo.toString();
                    cli.enviarATodosEnPartida(io, codigoStr, "usuarioSalido", res);
                    cli.enviarATodos(socket, "actualizarListaPartidas", lista);
                }

            })


            //ABANDONAR PARTIDA
            socket.on("abandonarPartida", function (nick, codigo) {
                let jugador = juego.obtenerUsuario(nick);
                let partida = juego.obtenerPartida(codigo)

                let codigoStr = codigo.toString();
                if (jugador && partida) {
                    let rival = partida.obtenerRival(nick);
                    if (rival == undefined) {
                        cli.enviarAlRemitente(socket, "partidaCancelada", { codigoP: codigo })
                        partida.abandonarPartida(jugador)
                        let lista = juego.obtenerPartidasDisponibles();
                        cli.enviarATodos(socket, "actualizarListaPartidas", lista);
                    } else {
                        let res = { codigoP: codigo, nombreA: jugador.nick, nombreG: rival.nick }
                        partida.abandonarPartida(jugador)
                        cli.enviarATodosEnPartida(io, codigoStr, "partidaAbandonada", res);
                        socket.leave(codigoStr)
                    }
                }
            });



            //COLOCAR BARCO
            socket.on("colocarBarco", function (nick, nombre, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let desplegado = jugador.colocarBarco(nombre, x, y)
                    let res = { barco: nombre, x: x, y: y, colocado: desplegado }
                    cli.enviarAlRemitente(socket, "barcoColocado", res);
                }
            });




            //BARCOS DESPLEGADOS
            socket.on("barcosDesplegados", function (nick) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let partida = jugador.partida;
                    let res = jugador.barcosDesplegados();
                    let codigoStr = partida.codigo.toString();

                    if (partida.esJugando()) {

                        cli.enviarATodosEnPartida(io, codigoStr, "aJugar", {});

                    }

                }
            });



            //DISPARAR
            socket.on("disparar", function (nick, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                let res = { jugador: nick, disparoX: x, disparoY: y }
                if (jugador) {
                    let partida = jugador.partida;
                    let turno = partida.obtenerTurno();


                    if (jugador == turno) {
                        let impacto = jugador.disparar(x, y)
                        console.log(impacto, "ServSo")
                        let codigoStr = partida.codigo.toString();
                        if (partida.esFinal()) {
                            cli.enviarATodosEnPartida(io, partida.codigo.toString(), "finalPartida", jugador.nick);
                        }

                        let res2 = { atacante: jugador.nick, impacto: impacto, x: x, y: y, turno: turno.nick }
                        cli.enviarATodosEnPartida(io, codigoStr, "disparo", res2);
                    }
                    else {
                        cli.enviarAlRemitente(socket, "noEsTuTurno", res);
                    }
                }
            });
        });
    }
}
module.exports.ServidorWS = ServidorWS;