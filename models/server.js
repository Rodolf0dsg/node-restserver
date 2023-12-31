const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares: Funciones que siempre se vana  ejecutar antes de hacer algo
        this.middlewares();

        //rutas de la aplicacion
        this.routes();
    };

    middlewares() {

        //CORS
        this.app.use( cors() )
        
        //Lectura y parseo del body
        this.app.use( express.json() )

        //directorio publico, use es un middleware
        this.app.use( express.static('public') );

    }

    routes(){

        this.app.use( this.usuariosPath , require('../routes/usuarios'))

    };

    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server