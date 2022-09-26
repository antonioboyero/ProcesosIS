function Juego(){
	this.partidas={};	//array asociativo
	this.usuarios={};	//array asociativo

	this.agregarUsuario=function(nick){
		if(!this.usuarios[nick]){									//miramos si existe el usuario y si no lo creo
			this.usuarios[nick]=new this.usuarios(nick,this)
		}
	}

	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}

	this.crearPartida=function(nick){
		let codigo = Date.now();
		this.partidas[codigo]=new Partida(codigo, nick);
		return codigo;
	}

	this.unirseAPartida=function(codigo, nick){

		if (this.partidas[codigo]){
            this.partidas[codigo].agregarJugador(nick);
		}else{
			console.log("La partida no existe");
		}

		this.obtenerPartidas=function(){
			let lista;
			//for(i=0;i++;i<this.partidas.length)
			for (let key in this.partidas){
				lista.push({"codigo":key,"owner":this.partidas[key].owner});
			}
			return lista;
		}

		this.obtenerPartidasDisponibles=function(){
			//devolver solo las partdias que aun no esten completas
		}
	}
}



function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego; //esto es lo que hemos dicho que es navegable, por eso hemos añadido end1 juego 1 etc
	this.crearPartida=function(){
		this.juego.crearPartida(this.nick)
	}
	this.unirseAPartida=function(codigo, nick){
		this.juego.unirseAPartida(codigo, this.nick);
	}
}

function Partida(codigo, nick){
	this.codigo=codigo;
	this.owner=nick;
	this.jugadores=[];  //array normal o asociativo
	//this.maxjugadores=2;
	this.fase="inicial";
	this.agregarJugador=function(nick){

		if (this.jugadores.length<2){
			this.jugadores.push(nick);
		}else{
			console.log("La partida está completa");
		}

	}
}