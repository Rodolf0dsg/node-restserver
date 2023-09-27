const { request, response } = require('express')


const usuariosGet = ( req= request , res = response ) => { //obtener

    // const query = req.query; //extrae los queryparams
    const { q, nombre, apikey = 'No api key' } = req.query;


    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = ( req, res = response ) => { // crear

    const { nombre, edad } = req.body; //validacion para recibir solo lo que yo quiero
    //porque en el body muchas veces mandan scripts o inyecciones

    res.json({
        msg: 'post API - controlador',
        nombre,
        edad,
    });
}

const usuariosPut = ( req, res = response ) => { //actualizar

    const { id } = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosDelete = ( req, res = response ) => { //eliminar
    res.json({
        msg: 'delete API - controlador',
    });
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