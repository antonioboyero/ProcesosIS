var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;



function Cad() {

    this.logs=undefined;

    //logs
    this.insertarLog = function (log, callback) {
        insertar(this.logs, log, callback);
    }


    //partidas
    //usuarios
    this.insertarPartida = function (partida, callback) {
        insertar(this.partidas, partida, callback)
    }



    this.insertarUsuario = function (usuario, callback) {
        insertar(this.usuarios, usuario, callback)
    }




    this.obtenerLogs = function (callback) {
        obtenerTodos(this.logs, callback)
    }




    this.obtenerTodos = function(coleccion, callback){
        coleccion.find().toArray(function(error, col){
            callback(col);
        })
    }




    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }





    this.conectar = function () {
        let cad = this;

        mongo.connect("mongodb+srv://antonioboyero:<password>@cluster0.rm1g9cf.mongodb.net/?retryWrites=true&w=majority", { useUnifiedTopology: true }, function (err, database) {

            if (!err) {
                //Poner mi nombre en vez de batalla eso es lo que puso Gallud
                console.log("Conectado a MongoDB Atlas")
                database.db("Cluster0").collection("logs", function (err, col) {
                    if (err) {
                        console.log("No se puede obtener la coleccion")
                    }
                    else {
                        console.log("tenemos la colección de logs");
                        cad.logs = col;
                    }
                });

            } else {
                console.log("No se pudo conectar con MongoDB Atlas")
            }
        });

    }
}

module.exports.Cad = Cad;


//Iniciar sesion, crear partida, unir a partida, abandonar partida, partida finalizada, usuario sale