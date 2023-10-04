const { request, response } = require("express");


const esAdminRole = ( req = request, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin el token primero',
        });
    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es un administrador`,
        });
    }

    next();
}


const tieneRole = ( ...roles ) => {

    return ( req, res, next ) => {

        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin el token primero',
            });
        }

        if( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                msg: 'Este usuario no tiene los permisos necesarios - [ROL]',
            });
        }

        next();
    }

}

//si quiero recibir argumentos en un middleware, primero recibe los argumentos
//en una funcion principal ( ...roles ) y luego retorna la funcion con el req, res y el next


module.exports = {
    esAdminRole,
    tieneRole,
}