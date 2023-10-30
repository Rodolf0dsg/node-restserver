const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId, //tiene q ser otro objeto de mongo
        ref: 'Usuario', //hacia donde va a apuntar la relacion
        required: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId, //tiene q ser otro objeto de mongo
        ref: 'Categoria', //hacia donde va a apuntar la relacion
        required: true,
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true }
})

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...datos } = this.toObject();

    return datos;
}

module.exports = model( 'Producto' , ProductoSchema );