const mongoose = require('mongoose');

const dbConnection = async () => {

    try {


        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false, ya vienen por defecto en false
            //de hecho al parecer no hay que enviar nada en opciones, ya todo viene
            //por defecto como deberia ser
        } );

        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error en la inicializacion de la bd')
    }

}



module.exports = {
    dbConnection,
}

