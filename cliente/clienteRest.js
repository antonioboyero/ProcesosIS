function clienteRest() {
    this.nick;
    this.agregarUsuario = function (nick) {
        let cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            //se ejecuta cuando conteste el servidor
            console.log(data);
            if (data.nick != -1) {
                console.log("usuario"+data.nick+"registrado")
                cli.nick=data.nick;
                // ws.nick = data.nick;
                //$.cookie("nick",ws.nick);
                //iu.mostrarHome(data);
            }
            else {
                console.log("no se ha podido registrar el usuario")
                //iu.mostrarModal("El nick ya está en uso");
                //iu.mostrarAgregarJugador();
            }
        });
        //todavia no estoy seguro de que haya contestado el servidor
        //lo que pongas aqui se ejecuta a la vez que la llamada
    }

    this.crearPartida = function (nick) {
        let cli = this;
        $.getJSON("/crearPartida/" + nick, function (data) {
            //se ejecuta cuando conteste el servidor
            console.log(data);
            let codigo=Date.now;
            if (data.nick != -1) {
                console.log("usuario"+cli.nick+"ha creado una partida con el código: "+codigo);
                return codigo;
                // ws.nick = data.nick;
                //$.cookie("nick",ws.nick);
                //iu.mostrarHome(data);
            }
            else {
                console.log("no se ha podido crear la partida")
                //iu.mostrarModal("El nick ya está en uso");
                //iu.mostrarAgregarJugador();
            }
        });
    }


    this.unirseAPartida = function (nick, codigo) {
        let cli = this;
        $.getJSON("/unirseAPartida/" + nick +"/" + codigo, function (data) {
            //se ejecuta cuando conteste el servidor
            console.log(data);
            let codigo=Date.now;
            if (data.nick != -1) {
                console.log("usuario"+cli.nick+"se ha unido a la partida que tiene el código: "+codigo);
                return codigo;
                // ws.nick = data.nick;
                //$.cookie("nick",ws.nick);
                //iu.mostrarHome(data);
            }
            else {
                console.log("no se ha podido unir a la partida")
                //iu.mostrarModal("El nick ya está en uso");
                //iu.mostrarAgregarJugador();
            }
        });
    }

}