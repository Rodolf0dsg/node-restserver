const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

/**
 * Colecciones validas en la base de datos
 */
const coleccionesPermitidas = [
    'categorias',
    'usuarios',
    'productos',
    'roles',
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {

        const usuario = await Usuario.findById( termino )
        return res.json({
            results: (usuario) ? [ usuario ] : [],
        });

    } 

    const regex = new RegExp( termino, 'i'); // para que no sea case sensitive

    const usuarios = await Usuario.find({ 
        $or: [ { nombre: regex }, { correo: regex} ], //el $ es una bandera en el find para hacer busquedas complejas con operadores logicos como $or, $and, $where, $nor, $comment, $text
        $and: [{ estado: true }]
     });
    return res.json({
        results: [ usuarios ],
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {

        const categoria = await Categoria.findById( termino )
        return res.json({
            results: (categoria) ? [ categoria ] : [],
        });

    } 

    const regex = new RegExp( termino, 'i'); // para que no sea case sensitive

    const categorias = await Categoria.find({ nombre: regex, estado: true });
    return res.json({
        results: [ categorias ],
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {

        const producto = await Producto.findById( termino )
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [ producto ] : [],
        });

    } 

    const regex = new RegExp( termino, 'i'); // para que no sea case sensitive

    const productos = await Producto.find({ nombre: regex, estado: true})
        .populate('categoria', 'nombre');
    return res.json({
        results: productos ,
    });

}

const buscar = ( req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas} `,
        })
    };

    switch ( coleccion ) {

        case 'categorias':
            buscarCategorias( termino, res );
            break;
        case 'usuarios':
            buscarUsuarios( termino, res ); //se manda el termino y la respuesta para porder hacer un res.json
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
        case 'roles':

            break;
    
        default:
            res.status(500).json({
                msg: 'Parametro no valido',
            })
            break;
    }

    // return res.json({
    //     "msg": "buscar",
    //     coleccion,
    //     termino
    // })

}

module.exports = {
    buscar,
}