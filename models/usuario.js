const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'], //el segundo slot del array es un mensaje en caso de que no mande este dato que es required
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'], 
        unique: true, //sin duplicados
    },
    password: {
        type: String,
        required: [true, 'La contrase;a es obligatoria'], 
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: [true, 'El nombre es obligatorio'], 
        enum: ['ADMIN_ROLE', 'USER_ROLE'], //valida que el rol sea o ADMIN_ROLE o USER_ROLE (o cualquier opcion que este en el array)
    },
    password: {
        type: String,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

usuarioSchema.methods.toJSON = function () {
    const { __v, password, ...usuario } = this.toObject()
    return usuario;
}

//para eliminar __v y password del json recibido

//se hace de esta manera porque al parecer siempre que se envia una respuesta
//se utiliza el metodo toJSON, que en este momento se esta sobreescribiendo 
//para que solo retorne los valores a combeniencia

module.exports = model( 'Usuario', usuarioSchema ) 
//model recibe el nombre en SINGULAR y el esquema
//IMPORTANTE QUE EL NOMBRE EMPIEZE CON UNA MAYUSCULA
//por defecto mongoose le agrega una s al nombre del modelo, en este caso se llama usuario, mongoose le agregara s quedando en usuarios