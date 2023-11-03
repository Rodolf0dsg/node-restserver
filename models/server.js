const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

const fileUpload = require('express-fileupload')

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads',
        }

        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

        //conectar a la base de datos
        this.conectarDB();

        //Middlewares: Funciones que siempre se vana  ejecutar antes de hacer algo
        this.middlewares();

        //rutas de la aplicacion
        this.routes();
    };

    async conectarDB() {

        await dbConnection();

    }

    middlewares() {

        //CORS
        this.app.use( cors() )
        
        //Lectura y parseo del body
        this.app.use( express.json() )

        //directorio publico, use es un middleware
        this.app.use( express.static('public') );

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true, //si no existe la carpeta para mover un archivo la crea
        }));

    }

    routes(){

        this.app.use( this.paths.auth ,       require('../routes/auth'));
        this.app.use( this.paths.usuarios ,   require('../routes/usuarios'));
        this.app.use( this.paths.categorias , require('../routes/categorias'));
        this.app.use( this.paths.productos ,  require('../routes/productos'));
        this.app.use( this.paths.buscar ,     require('../routes/buscar'));
        this.app.use( this.paths.uploads ,    require('../routes/uploads'));
        
    };

    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server