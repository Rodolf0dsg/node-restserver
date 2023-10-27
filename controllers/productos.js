const { request, response } = require("express");
const { Producto } = require('../models');

const obtenerProductos = async ( req = request, res = response ) => {

    const filtro = { estado: true };

    const { limite = 5 , desde = 0 } = req.query;

    const [ productos, total ] = await Promise.all([
        Producto.find( filtro )
            .skip( desde )
            .limit( limite )
            .populate( 'usuario', 'nombre' )
            .populate( 'categoria', 'nombre' ),

        Producto.countDocuments( filtro ),

     ]);

     res.json({
        total,
        productos
     })

}

const obtenerProducto = async ( req = request, res = response ) => {

    const { id } = req.params;

    console.log( 'hola marico', req.paramas );

    const producto = await Producto.findById( id )
        .populate( 'usuario', 'nombre' ) //para ver el nombre de quien creo esa producto
        .populate( 'categoria', 'nombre' ) ;

    res.json( producto )

}

const crearProducto = async( req = request, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre })

    if ( productoDB ) {

        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`,
        })
        
    }

    const data = {
        nombre, 
        usuario: req.usuario._id,
        ...body,
    }
    
    console.log( data );
    

    const producto = await new Producto({ data });

    await producto.save();

    res.status(201).json( producto );
}

const actualizarProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    // console.log( data.nombre, data )

    if( data.nombre ) data.nombre  = data.nombre.toUpperCase();

    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true }); 
    //new en true para que mande el documento o nuevo archivo actualizado en la respuesta ( response )

    return res.json( producto );

}

const eliminarProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );

    return res.json({
        producto
    })

}

module.exports = {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductos,
}