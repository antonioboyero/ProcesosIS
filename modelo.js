function Juego(){
	this.partidas=[];
	this.agregarPartida=function(nombre){
		this.partidas.push(new Partida(nombre))
	}
	this.eliminarPartida=funciton(nombre){
		//todo
	}
}

function Partida(nombre){
	this.nombre=nombre;
}