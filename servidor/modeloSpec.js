Modelo = require("../servidor/modelo.js");
Juego = Modelo.Juego;


describe("El juego...", function () {
  var miJuego;
  var usr1, usr2;
  var usuarios;
  var partida, partidaCod;
  const nick1 = "pepe";
  const nick2 = "luis";
  const nick3 = "pepa";

  describe("Pruebas adicionales", function () {
      beforeEach(function () {
          miJuego = new modelo.Juego(true);

          miJuego.agregarUsuario(nick1);
          usr1 = miJuego.obtenerUsuario(nick1);
      });

      it("Comprobar que no deja unirse si ya existe un jugador con ese nick", function () {
          res = miJuego.agregarUsuario(nick1);
          error = -1;
  
          expect(res.nick).toEqual(error);
      });

      it("Comprobar que si un usuario se sale del juego luego puede meterse otro con el mismo nick", function () {
          miJuego.usuarioSale(nick1);

          expect(miJuego.obtenerUsuarios().length).toEqual(0);

          miJuego.agregarUsuario(nick1);
          usr1 = miJuego.obtenerUsuario(nick1);

          expect(miJuego.obtenerUsuario(nick1)).toEqual(usr1);
      });

      it("Comprobar que no hay partidas", function () {
          expect(miJuego.obtenerPartidas().length).toEqual(0);
      });

      it("Comprobar que no se puede unir a una partida que no existe", function () {
          let res = miJuego.jugadorSeUneAPartida(nick1, 1);
          partidaCod = res.codigo;
          error = -1;

          expect(partidaCod).toEqual(error);
      });

      it("Comprobar que al crear una partida el juego pasa a la fase inicial", function () {
          let res = miJuego.jugadorCreaPartida(nick1);
          partidaCod = res.codigo;
          partida = miJuego.obtenerPartida(partidaCod);
          expect(partida.esInicial()).toEqual(true);
      });

      it("Comprobar que una partida deja de estar disponible al llenarse", function () {
          let res = miJuego.jugadorCreaPartida(nick1);
          partidaCod = res.codigo;
          partida = miJuego.obtenerPartida(partidaCod);
          
          expect(partida.hayHueco()).toEqual(true);
  
          miJuego.agregarUsuario(nick2);
          usr2 = miJuego.obtenerUsuario(nick2);

          miJuego.jugadorSeUneAPartida(nick2, partidaCod);
  
          expect(partida.hayHueco()).toEqual(false);
      });

      it("Comprobar que si un jugador abandona la partida, esta finaliza pero los dos usuarios siguen en el juego", function () {
          let res = miJuego.jugadorCreaPartida(nick1);
          partidaCod = res.codigo;
          partida = miJuego.obtenerPartida(partidaCod);
  
          miJuego.agregarUsuario(nick2);
          usr2 = miJuego.obtenerUsuario(nick2);

          usuarios = miJuego.obtenerUsuarios();

          miJuego.jugadorSeUneAPartida(nick2, partidaCod);
  
          partida.abandonarPartida(usr2);

          expect(partida.esDesplegando()).toEqual(false);
          expect(partida.esFinal()).toEqual(true);

          expect(usuarios.length).toEqual(2);
          expect(usuarios[0].nick).toEqual(nick1);
          expect(usuarios[1].nick).toEqual(nick2);
      });

      it("Comprobar que si un jugador sale de la partida, esta finaliza y ese usuario sale del juego pero su rival sigue dentro", function () {
          let res = miJuego.jugadorCreaPartida(nick1);
          partidaCod = res.codigo;
          partida = miJuego.obtenerPartida(partidaCod);
  
          miJuego.agregarUsuario(nick2);
          usr2 = miJuego.obtenerUsuario(nick2);

          usuarios = miJuego.obtenerUsuarios();

          expect(usuarios.length).toEqual(2);

          miJuego.jugadorSeUneAPartida(nick2, partidaCod);
  
          miJuego.usuarioSale(nick2);

          usuarios = miJuego.obtenerUsuarios();

          expect(partida.esDesplegando()).toEqual(false);
          expect(partida.esFinal()).toEqual(true);

          expect(usuarios.length).toEqual(1);
          expect(usuarios[0].nick).toEqual(nick1);
      });

      it("Comprobar que si tres jugadores intentan unirse a la misma partida al tercero le da error", function () {
          let res = miJuego.jugadorCreaPartida(nick1);
          partidaCod = res.codigo;
          partida = miJuego.obtenerPartida(partidaCod);
          error = -1;
  
          miJuego.agregarUsuario(nick2);
          usr2 = miJuego.obtenerUsuario(nick2);

          miJuego.agregarUsuario(nick3);

          let res2 = miJuego.jugadorSeUneAPartida(nick2, partidaCod);
          let res3 = miJuego.jugadorSeUneAPartida(nick3, partidaCod);
  
          expect(res2.codigo).toEqual(partidaCod);
          expect(res3.codigo).toEqual(error);
      });
  });

  beforeEach(function () {
      miJuego = new modelo.Juego(true);

      miJuego.agregarUsuario(nick1);
      usr1 = miJuego.obtenerUsuario(nick1);

      miJuego.agregarUsuario(nick2);
      usr2 = miJuego.obtenerUsuario(nick2);

      let res = miJuego.jugadorCreaPartida(nick1);
      partidaCod = res.codigo;
      miJuego.jugadorSeUneAPartida(nick2, partidaCod);

      partida = miJuego.obtenerPartida(partidaCod);
  });

  it("Comprobar los nick de los usuarios", function () {
      expect(usr1.nick).toEqual(nick1);
      expect(usr2.nick).toEqual(nick2);
  });

  it("Comprobar que los dos usuarios están en la partida", function () {
      expect(partida.estoy(nick1)).toEqual(true);
      expect(partida.estoy(nick2)).toEqual(true);
  });

  it("Comprobar que los dos jugadores tienen tablero propio, tablero rival y que todas las casillas de los tableros son agua", function () {
      expect(usr1.tableroPropio).toBeDefined();
      expect(usr1.tableroRival).toBeDefined();

      expect(usr2.tableroPropio).toBeDefined();
      expect(usr2.tableroRival).toBeDefined();

      expect(usr1.tableroPropio.casillas.length).toEqual(10);
      expect(usr2.tableroPropio.casillas.length).toEqual(10);

      for (x = 0; x < 10; x++) {
          for (y = 0; y < 10; y++) {
              expect(usr1.tableroPropio.casillas[x][y].contiene.esAgua()).toEqual(true);
              expect(usr2.tableroPropio.casillas[x][y].contiene.esAgua()).toEqual(true);
          }
      }
  });

  it("Comprobar que los dos jugadores tienen flota y todos los barcos tienen el tamaño y la orientacion correctos", function () {
      expect(usr1.flota).toBeDefined();
      expect(usr2.flota).toBeDefined();

      expect(Object.keys(usr1.flota).length).toEqual(7);
      expect(Object.keys(usr2.flota).length).toEqual(7);

      expect(usr1.flota["Submarino (1)"].tam).toEqual(1);
      expect(usr1.flota["Destructor Horizontal(2)"].tam).toEqual(2);
      expect(usr1.flota["Destructor Vertical(2)"].tam).toEqual(2);
      expect(usr1.flota["Crucero Horizontal(3)"].tam).toEqual(3);
      expect(usr1.flota["Crucero Vertical(3)"].tam).toEqual(3);
      expect(usr1.flota["Acorazado Horizontal(4)"].tam).toEqual(4);
      expect(usr1.flota["Acorazado Vertical(4)"].tam).toEqual(4);

      expect(usr1.flota["Submarino (1)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr1.flota["Destructor Horizontal(2)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr1.flota["Destructor Vertical(2)"].orientacion.esVertical()).toEqual(true);
      expect(usr1.flota["Crucero Horizontal(3)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr1.flota["Crucero Vertical(3)"].orientacion.esVertical()).toEqual(true);
      expect(usr1.flota["Acorazado Horizontal(4)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr1.flota["Acorazado Vertical(4)"].orientacion.esVertical()).toEqual(true);

      expect(usr2.flota["Submarino (1)"].tam).toEqual(1);
      expect(usr2.flota["Destructor Horizontal(2)"].tam).toEqual(2);
      expect(usr2.flota["Destructor Vertical(2)"].tam).toEqual(2);
      expect(usr2.flota["Crucero Horizontal(3)"].tam).toEqual(3);
      expect(usr2.flota["Crucero Vertical(3)"].tam).toEqual(3);
      expect(usr2.flota["Acorazado Horizontal(4)"].tam).toEqual(4);
      expect(usr2.flota["Acorazado Vertical(4)"].tam).toEqual(4);

      expect(usr2.flota["Submarino (1)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr2.flota["Destructor Horizontal(2)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr2.flota["Destructor Vertical(2)"].orientacion.esVertical()).toEqual(true);
      expect(usr2.flota["Crucero Horizontal(3)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr2.flota["Crucero Vertical(3)"].orientacion.esVertical()).toEqual(true);
      expect(usr2.flota["Acorazado Horizontal(4)"].orientacion.esHorizontal()).toEqual(true);
      expect(usr2.flota["Acorazado Vertical(4)"].orientacion.esVertical()).toEqual(true);
  });

  it("Comprobar que la partida está en fase desplegando", function () {
      expect(partida.esInicial()).toEqual(false);
      expect(partida.esJugando()).toEqual(false);
      expect(partida.esFinal()).toEqual(false);

      expect(partida.esDesplegando()).toEqual(true);
  });

  describe("A jugar!", function () {
      beforeEach(function () {
          usr1.colocarBarco("Submarino (1)", 0, 0); //0,0
          usr1.colocarBarco("Destructor Horizontal(2)", 0, 1); //0,1 1,1
          usr1.colocarBarco("Destructor Vertical(2)", 0, 4); //0,4 0,5
          usr1.colocarBarco("Crucero Horizontal(3)", 0, 2); //0,2 1,2 2,2
          usr1.colocarBarco("Crucero Vertical(3)", 1, 4); //1,4 1,5 1,6
          usr1.colocarBarco("Acorazado Horizontal(4)", 0, 3); //0,3 1,3 2,3 3,3
          usr1.colocarBarco("Acorazado Vertical(4)", 2, 4); //2,4 2,5 2,6 2,7

          usr1.barcosDesplegados();

          usr2.colocarBarco("Submarino (1)", 0, 0); //0,0
          usr2.colocarBarco("Destructor Horizontal(2)", 0, 1); //0,1 1,1
          usr2.colocarBarco("Destructor Vertical(2)", 0, 4); //0,4 0,5
          usr2.colocarBarco("Crucero Horizontal(3)", 0, 2); //0,2 1,2 2,2
          usr2.colocarBarco("Crucero Vertical(3)", 1, 4); //1,4 1,5 1,6
          usr2.colocarBarco("Acorazado Horizontal(4)", 0, 3); //0,3 1,3 2,3 3,3
          usr2.colocarBarco("Acorazado Vertical(4)", 2, 4); //2,4 2,5 2,6 2,7

          usr2.barcosDesplegados();
      });

      it("Comprobar que las flotas están desplegadas", function () {
          expect(usr1.todosDesplegados()).toEqual(true);
          expect(usr2.todosDesplegados()).toEqual(true);
          expect(partida.flotasDesplegadas()).toEqual(true);
      });

      it("Comprobar que la partida está en fase jugando", function () {
          expect(partida.esDesplegando()).toEqual(false);

          expect(partida.esJugando()).toEqual(true);
      });

      it("Comprobar jugada que Pepe gana", function () {
          expect(partida.turno.nick).toEqual(nick1);

          expect(usr2.flota["Submarino (1)"].estado).toEqual("intacto");
          usr1.disparar(0, 0);
          expect(usr2.flota["Submarino (1)"].estado).toEqual("hundido");

          expect(usr2.flota["Destructor Horizontal(2)"].estado).toEqual("intacto");
          usr1.disparar(0, 1);
          expect(usr2.flota["Destructor Horizontal(2)"].estado).toEqual("tocado");
          usr1.disparar(1, 1);
          expect(usr2.flota["Destructor Horizontal(2)"].estado).toEqual("hundido");

          expect(usr2.flota["Destructor Vertical(2)"].estado).toEqual("intacto");
          usr1.disparar(0, 4);
          expect(usr2.flota["Destructor Vertical(2)"].estado).toEqual("tocado");
          usr1.disparar(0, 5);
          expect(usr2.flota["Destructor Vertical(2)"].estado).toEqual("hundido");

          expect(usr2.flota["Crucero Horizontal(3)"].estado).toEqual("intacto");
          usr1.disparar(0, 2);
          expect(usr2.flota["Crucero Horizontal(3)"].estado).toEqual("tocado");
          usr1.disparar(1, 2);
          expect(usr2.flota["Crucero Horizontal(3)"].estado).toEqual("tocado");
          usr1.disparar(2, 2);
          expect(usr2.flota["Crucero Horizontal(3)"].estado).toEqual("hundido");

          expect(usr2.flota["Crucero Vertical(3)"].estado).toEqual("intacto");
          usr1.disparar(1, 4);
          expect(usr2.flota["Crucero Vertical(3)"].estado).toEqual("tocado");
          usr1.disparar(1, 5);
          expect(usr2.flota["Crucero Vertical(3)"].estado).toEqual("tocado");
          usr1.disparar(1, 6);
          expect(usr2.flota["Crucero Vertical(3)"].estado).toEqual("hundido");

          expect(usr2.flota["Acorazado Horizontal(4)"].estado).toEqual("intacto");
          usr1.disparar(0, 3);
          expect(usr2.flota["Acorazado Horizontal(4)"].estado).toEqual("tocado");
          usr1.disparar(1, 3);
          expect(usr2.flota["Acorazado Horizontal(4)"].estado).toEqual("tocado");
          usr1.disparar(2, 3);
          expect(usr2.flota["Acorazado Horizontal(4)"].estado).toEqual("tocado");
          usr1.disparar(3, 3);
          expect(usr2.flota["Acorazado Horizontal(4)"].estado).toEqual("hundido");

          expect(usr2.flota["Acorazado Vertical(4)"].estado).toEqual("intacto");
          usr1.disparar(2, 4);
          expect(usr2.flota["Acorazado Vertical(4)"].estado).toEqual("tocado");
          usr1.disparar(2, 5);
          expect(usr2.flota["Acorazado Vertical(4)"].estado).toEqual("tocado");
          usr1.disparar(2, 6);
          expect(usr2.flota["Acorazado Vertical(4)"].estado).toEqual("tocado");
          usr1.disparar(2, 7);
          expect(usr2.flota["Acorazado Vertical(4)"].estado).toEqual("hundido");

          expect(usr1.flotaHundida()).toEqual(false);
          expect(usr2.flotaHundida()).toEqual(true);

          expect(partida.esJugando()).toEqual(false);

          expect(partida.esFinal()).toEqual(true);
      });

      it("Comprobar que al disparar en agua se cambia de turno", function () {
          expect(partida.turno.nick).toEqual(nick1);
          disparo = usr1.disparar(7, 7);
          expect(disparo).toEqual("agua");
          expect(partida.turno.nick).toEqual(nick2);
      });

      it("Comprobar que no deja disparar sin turno", function () {
          expect(partida.turno.nick).toEqual(nick1);
          usr2.disparar(0, 0);
          expect(usr1.flota["Submarino (1)"].estado).toEqual("intacto");
      });
  });
});