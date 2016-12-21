var mongoose = require('mongoose');

//Definicion del esquema
var Schema = mongoose.Schema;

var esquemaHabitacion = new Schema({
    "numeroHabitacion": Number,
    "tipo": String,
    "categoria": String,
    "precio": Number,
    "reservas": [
        {
            "idReserva": Number,
            "fechaEntrada": Date,
            "fechaSalida": Date,
            "email": String,
            "nombre": String
        }
    ]
});

module.exports = mongoose.model("Rooms", esquemaHabitacion);




