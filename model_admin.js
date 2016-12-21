var mongoose = require('mongoose');

var AdminSchema = mongoose.Schema;

var administrador = new AdminSchema({
    "usuario": String,
    "password": String,
    "email": String,
    "nombre": String,
    "apellido": String
});

module.exports = mongoose.model("Admins", administrador);