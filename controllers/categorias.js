const { request, response } = require("express");
const { Categoria } = require('../models')


//obtener categorias - paginado - total - populate

const obtenerCategorias = async( req = request, res = response) => {

    const filtro = { estado: true };

    const { limite = 5 , desde = 0 } = req.query;

    const [ categorias, total ] = await Promise.all([
        Categoria.find( filtro )
            .skip( desde )
            .limit( limite )
            .populate( 'usuario', 'nombre' ),

        Categoria.countDocuments( filtro ),

     ]);

     res.json({
        total,
        categorias
     })

}


//obtener categoria populate

const obtenerCategoria = async( req = request , res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id )
        .populate( 'usuario', 'nombre' ) //para ver el nombre de quien creo esa categoria

    res.json( categoria )

}


const crearCategoria = async( req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {

        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`,
        })
        
    }

    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    console.log( data );

    const categoria = await new Categoria( data );

    //Guardar la categoria en la DB

    await categoria.save();

    res.status(201).json(categoria)
    
}

//actualizar categoria

const actualizarCategoria = async( req = request, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;


    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true }); 
    //new en true para que mande el documento o nuevo archivo actualizado en la respuesta ( response )

    return res.json( categoria );

}

//borrar categoria

const borrarCategoria = async( req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );

    return res.json({
        categoria
    })

}


module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria,
}