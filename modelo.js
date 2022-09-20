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
		//obtener codigo único
		//crear la partida con propietario nick
		//devolver el codigo o la partida
		
	}
}

function Partida(){
	this.codigo;
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego; //esto es lo que hemos dicho que es navegable, por eso hemos añadido end1 juego 1 etc
	this.crearPartida=function(){
		this.juego.crearPartida(this.nick)
	}
}