const { Schema, model } = require('mongoose')

const categoriaSchema = Schema({
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
    }
})

categoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...datos } = this.toObject();

    return datos;
}

module.exports = model( 'Categoria' , categoriaSchema );