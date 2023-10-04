const Usuario = require('../models/usuario');
const { request, response } = require('express')
const jwt = require('jsonwebtoken');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion',
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            res.status(401).json({
                msg: 'Usuario no existe',
            })
        }

        // Verificar si el uid tiene estado en true ( activo )

        if ( !usuario.estado ) {
            res.status(401).json({
                msg: 'Token no valido - usuario inactivo',
            })
        }

        // req.uid = uid;
        req.usuario = usuario;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido',
        })
    }

    next();
    
}

module.exports = {
    validarJWT,
}