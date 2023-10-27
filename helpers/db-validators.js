const { Usuario, Categoria, Producto } = require('../models');

const Role = require('../models/role');

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });

    if( !existeRol ){
        throw new Error(`El rol ${ rol } no existe`);
    }
}

const existeUsuarioPorId = async ( id = '' ) => {
    const existe = await Usuario.findById( id );
    //findById es una validacion de mongoose o express-validator (nose) que verifica si existe un objeto con el id que se le envia
    
    if( !existe ){
        throw new Error(`El id ${ id } no existe en la bdd`);
    };
}

const existeEmail = async ( correo = '' ) => {
    const existe = await Usuario.findOne({ correo });
    //findOne es una validacion de mongoose o express-validator (nose) que verifica si existe un objeto con la propiedad y valor que se le envia
    
    if( existe ){
        // return res.status(400).json({
        //     msg: 'El correo ya esta registrado',
        // });
        throw new Error(`El correo ${ correo } ya existe en la bdd`);
    };
}

const existeCategoria = async( id ) => {

    const existe = await Categoria.findById( id );

    if( !existe ){
        throw new Error(`La categoria no existe en la bdd`)
    }
}

const existeProducto = async( id ) => {

    const existe = await Producto.findById( id );

    if( !existe ){
        throw new Error(`El producto no existe en la bdd`)
    }
}


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}