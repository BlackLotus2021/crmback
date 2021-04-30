const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required:true,
        trim:true
    },
    ciudad: {
        type: String,
        required:true,
        trim:true
    },
    pais: {
        type: String,
        required:true,
        trim:true
    },
    telefono: {
        type: String,
        required:false,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Usuario', UsuariosSchema);