const { request, response } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');


const usuariosGet = async( req= request , res = response ) => { //obtener

    const filtro = { estado: true };

    // const query = req.query; //extrae los queryparams
    // const { q, nombre, apikey = 'No api key', page = 1, limit } = req.query;

    //paginacion
    const { limite = 5 , desde = 0 } = req.query;

    // const usuarios = await Usuario.find( filtro ) //find recibe la condicion
    //     .skip(  Number( desde ) ) //desde donde, ej desde el 5 
    //     .limit( Number( limite) ); //limite recibe un numero

    // const total = await Usuario.countDocuments( filtro );

    const [ usuarios, total ] = await Promise.all([
        Usuario.find( filtro ) //find recibe la condicion
        .skip(  Number( desde ) ) //desde donde, ej desde el 5 
        .limit( Number( limite) ), //limite recibe un numero

        Usuario.countDocuments( filtro ),
        
    ])

    res.json({
        total,
        usuarios,
    });
}

const usuariosPost = async( req, res = response ) => { // crear

    // const { nombre, edad } = req.body; //validacion para recibir solo lo que yo quiero
    //porque en el body muchas veces mandan scripts o inyecciones

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario( {nombre, correo, password, rol} );
    //de esta manera se esta instanciando Usuario que es un modelo de mongoose
    //de esta manera, si en el body vienen datos que no estan definidos en el modelo de mongoose
    //mongoose los ignorara automaticamente por nosotros agregando una capa de seguridad extra
    //para no recibir datos innecesarios

    //////////////////


    //ENCRIPTAR LA CONTRASE;A/ ///////////////

    const salt = bcrypt.genSaltSync() //number of rounds to use, defaults to 10 if omitted
    //Synchronously generates a salt. Rounds es vueltas de encriptacion

    usuario.password = bcrypt.hashSync( password , salt );// hashSync encripta en 1 sola via

    //////////////////////

    await usuario.save(); //guardar el usuario recibido
    //en caso de que falten datos que sean requeridos en el modelo de usuario de la db
    //la peticion quedara pendiente por toda la eternidad
    

    res.json({
        // msg: 'post API - controlador',
        usuario,
    });
}

const usuariosPut = async( req, res = response ) => { //actualizar

    const { id } = req.params;

    const { _id ,password, google, correo, ...resto } = req.body; //hay que excluir el correo porque sino lo toma como repetido

    if( password ) {
        const salt = bcrypt.genSaltSync() //number of rounds to use, defaults to 10 if omitted
        //Synchronously generates a salt. Rounds es vueltas de encriptacion
    
        resto.password = bcrypt.hashSync( password , salt ); // hashSync encripta en 1 sola via  
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto ); //actualiza usuario por id

    res.json({
        msg: 'put API - controlador',
        usuario
    });
}

const usuariosDelete = async( req = request, res = response ) => { //eliminar

    const { id } = req.params;

    //borrado FISICO:
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id , { estado: false });
    // const usuarioAutenticado = req.usuario;

    res.json( usuario );
}

const usuariosPatch = ( req, res = response ) => { //eliminar
    res.json({
        msg: 'patch API - controlador',
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
}