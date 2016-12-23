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
    res.header("Access-Control-Allow-Origin", "*.*");
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

//Crear una nueva reserva en una habitacion.
routerRest.route("/rooms/:id")
    .put((request, response) => {
        let roomNumber = request.params.id;
        let reservaDoc = request.body;

        // TODO: ver la forma de pasar fecha entrada y salida.
        console.log(reservaDoc);
        reservaDoc.fechaEntrada = Date.parse(reservaDoc.fechaEntrada);
        reservaDoc.fechaSalida = Date.parse(reservaDoc.fechaSalida);
        console.log(reservaDoc);
        //Rooms.find({ "numeroHabitacion": roomNumber }, (error, room) => {
        Rooms.update({ "numeroHabitacion": roomNumber }, { $push: { reservas: reservaDoc } }, (error, room) => {
            //******************************
            if (error) {
                response.status(500).send('Update , Error al actualizar la room')
                //console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation)
                console.log('Update , Error al actualizar la room', error)
            } else {
                //Devuelve el  doc actualizado, incluyendo el _id

                response.json(room)
                console.log('room actualizada OK: ');
            }

        });
    });

//TODO get fecha incicio, fecha fin habitaciones libres (usuario,admin)
routerRest.route("/rooms/fechas/xxx")
    .put((request, response) => {

        let searchDoc = request.body;


        //fechainicio = "2015/11/04"
        //let fechafin = "2019/12/25"
        //console.log(fechainicio);
        fechainicio = Date.parse(searchDoc.fechainicio);
        fechafin = Date.parse(searchDoc.fechafin);

        Rooms.find({
            "reservas": {
                $elemMatch: {fechaEntrada: { $gte: fechainicio }, fechaSalida:{ $lte: fechafin }}
            }
        },(error,doc)=>{
            if (error){
                console.error(error);
            } else {
             response.json(doc);
             console.log("Resultado de la busqueda correcto")
            }

        });

    });
        /*   Rooms.find({
               "reservas": {
                   "$and":
                   [
                       { "reservas.fechaEntrada": { "$gte": new Date("2017/12/12") } },
                       { "reservas.fechaSalida": { "$lte": new Date("2019/12/12") } }
                   ]
               }, function(err, docs) {
                   response.json(docs);
               }
           });*/


//TODO get habitaciones ocupadas por fecha de entrada(admin)

//put modificar precio.
routerRest.route("/rooms/cambiarprecios/cambia/")
    .put((request, response) => {
        //{ "reservas.email": request.params.email }

        let precio = parseInt(request.body.precio);
        let tipo = request.body.tipo;
        let categoria = request.body.categoria;

        console.log("Precio: ", request.body.precio);

        Rooms.update({ "tipo": tipo, "categoria": categoria }, { "precio": precio }, { multi: true }, (error, room) => {
            if (error) {
                response.status(500).send('Update , Error al actualizar el precio de la room')
                console.log('Update , Error al actualizar le precio la room', error)
            } else {
                response.json(room)
                console.log('precio room actualizada OK: ');
            }

        });

    })

//put cancelar una reserva, por habitacion y email.
routerRest.route("/rooms/cancel/cancelar/")
    .put((request, response) => {
        //{ "reservas.email": request.params.email }

        let email = request.body.email;
        let numeroHabitacion = parseInt(request.body.numeroHabitacion);

        console.log("soy el 1", request.params.body);

        Rooms.update({ "numeroHabitacion": numeroHabitacion }, { $pull: { "reservas": { "email": email } } }, (error, room) => {
            //******************************
            if (error) {
                response.status(500).send('Update , Error al actualizar la room')
                //console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation)
                console.log('Update , Error al actualizar la room', error)
            } else {
                //Devuelve el  doc actualizado, incluyendo el _id

                response.json(room)
                console.log('room actualizada OK: ');
            }

        });

    })





//get find reserva por email cliente
//TODO no devolver las reservas donde no coincide el email
routerRest.route("/admin/buscareserva/:email")
    .get((request, response) => {


        let email = request.params.email;

        Rooms.find({ "reservas.email": email }, (error, rooms) => {
            response.json(rooms);
        })
    });






app.use("/", routerRest);


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

//loadInitialData();

administradores = [
    {
        "usuario": "Yvan",
        "password": "SoyYvan",
        "email": "yvan@yvan.com",
        "nombre": "Yvan",
        "apellido": "DelCurso"
    }
]
//loadInitialAdmin();
