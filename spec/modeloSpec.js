describe("El juego...", function() {
  var miJuego;
  var usr1, usr2;

  beforeEach(function() {
    miJuego=new Juego();
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("juan");
    usr1=miJuego.usuarios["pepe"];
    usr2=miJuego.usuarios["juan"];
  });

  it("inicialmente", function() {
    let lista=miJuego.obtenerPartidas();
    expect(lista.lenght).toEqual(0);
    expect(usr1.nick).toEqual("pepe");
    expect(usr2.nick).toEqual("juan");

  });
});
