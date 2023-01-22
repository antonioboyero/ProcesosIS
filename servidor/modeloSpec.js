let modelo = require("./modelo.js");


describe("El juego...", function () {
  var miJuego;
  var usr1, usr2;
  var partida, partidaCod;
  const nick1 = "pepe";
  const nick2 = "luis";

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

  it("Comprobar que los dos jugadores tienen flota y todos los barcos tienen el tamaño  correctos", function () {
      expect(usr1.flota).toBeDefined();
      expect(usr2.flota).toBeDefined();

      expect(Object.keys(usr1.flota).length).toEqual(5);
      expect(Object.keys(usr2.flota).length).toEqual(5);

      expect(usr1.flota["Fragata (1)"].tam).toEqual(1);
      expect(usr1.flota["Destructor (2)"].tam).toEqual(2);
      expect(usr1.flota["Acorazado (3)"].tam).toEqual(3);
      expect(usr1.flota["Submarino (4)"].tam).toEqual(4);
      expect(usr1.flota["Portaviones (5)"].tam).toEqual(5);

      expect(usr2.flota["Fragata (1)"].tam).toEqual(1);
      expect(usr2.flota["Destructor (2)"].tam).toEqual(2);
      expect(usr2.flota["Acorazado (3)"].tam).toEqual(3);
      expect(usr2.flota["Submarino (4)"].tam).toEqual(4);
      expect(usr2.flota["Portaviones (5)"].tam).toEqual(5);

  });

  describe("A jugar!", function () {
      beforeEach(function () {
          usr1.colocarBarco("Fragata (1)", 0, 0); //0,0
          usr1.colocarBarco("Destructor (2)", 0, 1); //0,1 1,1
          usr1.colocarBarco("Acorazado (3)", 0, 2); //0,2 1,2 2,2
          usr1.colocarBarco("Submarino (4)", 0, 3); //0,3 1,3 2,3 3,3
          usr1.colocarBarco("Portaviones (5)", 0, 4); //0,4 1,4 2,4 3,4 4,4 

          usr1.barcosDesplegados();

          usr2.colocarBarco("Fragata (1)", 0, 0); //0,0
          usr2.colocarBarco("Destructor (2)", 0, 1); //0,1 1,1
          usr2.colocarBarco("Acorazado (3)", 0, 2); //0,2 1,2 2,2
          usr2.colocarBarco("Submarino (4)", 0, 3); //0,3 1,3 2,3 3,3
          usr2.colocarBarco("Portaviones (5)", 0, 4); //0,4 1,4 2,4 3,4 4,4 

          usr2.barcosDesplegados();
      });

      it("Comprobar que las flotas están desplegadas", function () {
          expect(usr1.todosDesplegados()).toEqual(true);
          expect(usr2.todosDesplegados()).toEqual(true);
          expect(partida.flotasDesplegadas()).toEqual(true);
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
          expect(usr1.flota["Fragata (1)"].estado).toEqual("intacto");
      });
  });
});