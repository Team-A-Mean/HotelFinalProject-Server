var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');//Lo uso en lineas 7 y 8
var routerRest = express.Router();
var app = express();
var Rooms = require('./models');
var Admins = require('./model_admin');


//Este use es necesario para activar CORS y evitar
//errores del tipo: No 'Access-Control-Allow-Origin' , en la app cliente con angular.
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    next();
});
//************************************************************

//Sin esto no lee ni Json ni urlencoded
//Ver request.body en web de express
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
mongoose.connect("mongodb://10.0.3.10:27017/hotel");


//TODO get find all
routerRest.route("/rooms")
    .get((request, response) => {
        Rooms.find((error, rooms) => {
            response.json(rooms);
        })
    });
routerRest.route("/admin")
    .get((request, response) => {
        Admins.find((error, admins) => {
            response.json(admins);
        })
    });

routerRest.route("/rooms/:id")
    .put((request, response) => {
        let roomNumber = request.params.id;
        let reservaDoc = request.body;

        // TODO: ver la forma de pasar fecha entrada y salida.
        reservaDoc.fechaEntrada = new Date(reservaDoc.fechaEntrada);
        reservaDoc.fechaSalida = new Date(reservaDoc.fechaSalida);
        console.log(reservaDoc);
        Rooms.find({ "numeroHabitacion": roomNumber }, (error, room) => {
            roomEncontrada = room[0];
            //roomEncontrada.reservas = reservaDoc;
            //roomEncontrada.tipo = "el trweter";
            roomEncontrada.reservas.push(reservaDoc);
            roomEncontrada.save((error, room) => {
                if (error) {
                    response.status(500).send('Update , Error al actualizar la room')
                    //console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation)
                    console.log('Update , Error al actualizar la room', error)
                } else {
                    //Devuelve el  doc actualizado, incluyendo el _id

                    response.json(room)
                    console.log('room actualizada OK: ');
                }
            });//Fin de peli.save
            response.json(room);
        });
    });

//TODO get fecha incicio, fecha fin habitaciones libres (usuario,admin)
routerRest.route("/rooms/:fechaEntrada")
    .get((request, response) => {





        let fechainicio = request.params.fechaEntrada;
        console.log(fechainicio);
        //console.log("time:" + fechainicio.getMilliseconds())

        let fechafin = request.params.fechaSalida;
        Rooms.find({ "reservas.fechaEntrada": fechainicio, "reservas.fechaSalida": fechafin }, (error, room) => {
            console.log(room);
        })

    })
//TODO get habitaciones ocupadas por fecha de entrada(admin)

//TODO put modificar precio. findandupdate(admin) Posibilidad de visualizar los precios previamente

//TODO put ingresar una nueva reserva

//TODO put cancelar una reserva

routerRest.route("/coches/:alias")
    .get((request, response) => {
        // TODO: obtener el coche a partir de su idCoche
        response.json({ _id: 1, marca: "opel", modelo: "corsa" })
    })
    .delete((request, response) => {
        response.json({ message: "borrado" });
    })
    .put((request, response) => {
        //TODO: Obtener el id y del body obtener marca y modelo
        response.json({ message: "actualizado" });
    });
app.use("/", routerRest);



/*
function getHabitaciones() {
    return Habitacion.find();
}

function nuevaHabitacion() {
    return Habitacion.save((error) => {
        console.error("Error", error);
    });
}

*/

/*
function cargaInicial() {
    Habitacion.create(this.habitaciones);
}
cargaInicial();
*/

function loadInitialData() {
    for (var i = 0; i < this.habitaciones.length; i++) {
        var habitacion = new Rooms(habitaciones[i]);
        habitacion.save();
    }
}
function loadInitialAdmin() {
    for (var i = 0; i < this.administradores.length; i++) {
        var administrador = new Admins(administradores[i]);
        administrador.save();
    }
}


app.listen(3000, () => console.log('Hola, estamos conectados'));


//Arrary de habitaciones

habitaciones = [
    {
        "numeroHabitacion": 1,
        "tipo": "simple",
        "categoria": 'normal',
        "precio": 100,
        "reservas": [

        ]
    }

    ,
    {
        "numeroHabitacion": 2,
        "tipo": 'doble',
        "categoria": 'normal',
        "precio": 150,
        "reservas": [

        ]
    },

    {
        "numeroHabitacion": 3,
        "tipo": 'simple',
        "categoria": 'superior',
        "precio": 200,
        "reservas": [

        ]
    },

    {
        "numeroHabitacion": 4,
        "tipo": 'doble',
        "categoria": 'normal',
        "precio": 300,
        "reservas": [

        ]
    }


]

loadInitialData();

administradores = [
    {
        "usuario": "Yvan",
        "password": "SoyYvan",
        "email": "yvan@yvan.com",
        "nombre": "Yvan",
        "apellido": "DelCurso"
    }
]
loadInitialAdmin();
