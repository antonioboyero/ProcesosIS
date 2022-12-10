function Tablero() {

    //añadir el update cell linea 673 battleboat
    this.placingOnGrid = false;
    this.nombreBarco;
    this.flota;
    this.size = size;



    this.ini = function () {
        var humanCells = document.querySelector('.human-player').childNodes;
        for (var k = 0; k < humanCells.length; k++) {
            humanCells[k].self = this;
            humanCells[k].addEventListener('click', this.placementListener, false);
            //humanCells[k].addEventListener('mouseover', this.placementMouseover, false);
            //humanCells[k].addEventListener('mouseout', this.placementMouseout, false);
        }
        var computerCells = document.querySelector('.computer-player').childNodes;
        for (var j = 0; j < computerCells.length; j++) {
            computerCells[j].self = this;
            computerCells[j].addEventListener('click', this.shootListener, false);
        }
    }




    this.rosterListener = function (e) {
        var self = e.target.self;
        var cli = this;
        // Remove all classes of 'placing' from the fleet roster first
        var roster = document.querySelectorAll('.fleet-roster li');
        for (var i = 0; i < roster.length; i++) {
            var classes = roster[i].getAttribute('class') || '';
            classes = classes.replace('placing', '');
            roster[i].setAttribute('class', classes);
        }

        // Set the class of the target ship to 'placing'
        self.nombreBarco = e.target.getAttribute('id');
        document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
        //Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
        self.placingOnGrid = true;
    };




    this.placementListener = function (e) {
        self = e.target.self;
        if (self.placingOnGrid) {
            // Extract coordinates from event listener
            var x = parseInt(e.target.getAttribute('data-x'), 10);
            var y = parseInt(e.target.getAttribute('data-y'), 10);

            self.colocarBarco(x, y, self.nombreBarco);

        }
    };





    this.endPlacing = function (shipType) {
        document.getElementById(shipType).setAttribute('class', 'placed');
        self.placingOnGrid = false;
    }





    this.colocarBarco = function (nombre, x, y) {
        console.log("Barco: " + nombre + " x: " + x + " y: " + y);
        cws.colocarBarco(nombre, x, y);
        return true;
    };



    this.puedesColocarBarco = function (data) {//nombre,x,y,colocado
        //obtener el barco a partir del nombre
        //bucle del tamaño del barco que marque las celdas
        for (i = 0; i < barco.tam; i++) {
            console.log("x: " + (x + i) + " y:" + y);
            this.updateCell(x + i, y, "ship", 'human-player');
        }
        self.endPlacing(barco.nombre);
    };



    this.updateCell = function (x, y, type, targetPlayer) {
        var player;
        //aquí hemos eliminado el código
        var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
        document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    };




    this.mostrarTablero = function (si) {
        console.log("Entro a mostrar tablero")
        let x = document.getElementById("tablero");
        if (si) {
            x.style.display = "block";
        }
        else {
            x.style.display = "none";
        }

    };
    //manejadores (click en tablero propi,click tablero rival)
    //updateCell (actualiza las celdas)




    this.crearGrid = function () {
        var gridDiv = document.querySelectorAll('.grid');
        for (var grid = 0; grid < gridDiv.length; grid++) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var el = document.createElement('div');
                    el.setAttribute('data-x', j);
                    el.setAttribute('data-y', i);
                    el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
                    gridDiv[grid].appendChild(el);
                }
            }
        }
    };




    this.crearGrid = function () {
        console.log("Entro en crear grid")
        var gridDiv = document.querySelectorAll('.grid');

        for (var grid = 0; grid < gridDiv.length; grid++) {
            //gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js')); // Removes the no-js warning
            let myNode = gridDiv[grid];
            while (myNode.lastElementChild) {
                myNode.removeChild(myNode.lastElementChild);
            }
            console.log(this.size)
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    var el = document.createElement('div');
                    el.setAttribute('data-x', j);
                    el.setAttribute('data-y', i);
                    el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
                    gridDiv[grid].appendChild(el);
                }
            }
        }
    };





    this.asignarFlotaListener = function () {
        var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
        for (var i = 0; i < playerRoster.length; i++) {
            playerRoster[i].self = this;
            playerRoster[i].addEventListener('click', this.rosterListener, false);
        }
    }

    //colocar en el index.html los div class grid
    //cargar en el index.html los estilos





    this.shootListener = function (e) {
        var x = parseInt(e.target.getAttribute('data-x'), 10);
        var y = parseInt(e.target.getAttribute('data-y'), 10);
        console.log("disparo x: " + x + " y: " + y);
        cws.disparar(x, y);
    }




    this.elementosGrid = function () {
        console.log("Entro en elementos grid")
        $('#gc').remove();
        let cadena = '<div class="game-container" id="gc">';
        cadena = cadena + '<div id="roster-sidebar">';
        cadena = cadena + '<h4>Barcos</h4><div id="flota"></div></div><div class="grid-container"><h2>Tu flota</h2>';
        cadena = cadena + '<div class="grid human-player"></div></div><div class="grid-container">';
        cadena = cadena + '<h2>Flota enemiga</h2><div class="grid computer-player"></div></div>'
        cadena = cadena + '<div></div></div>';
        $('#tablero').append(cadena);
        this.crearGrid();

        // $("#btnAyuda").on("click", function () {
        // 	iu.mostrarModal('<img src="cliente/img/ayuda.png"')
        // })
    }





    this.mostrarFlota = function () {
        $("#listaF").remove();
        let cadena = '<ul class="fleet-roster" id="listaF">';
        for (let key in this.flota) {
            cadena = cadena + "<li id='" + key + "'>" + key + "</li>"
        }
        cadena = cadena + "</ul>";
        $('#flota').append(cadena);
        //<ul>
        //	cadena=cadena+'<li id="b2">b2</li>'
        //</ul>
        this.asignarFlotaListener();
    }



}//fin funcion tablero