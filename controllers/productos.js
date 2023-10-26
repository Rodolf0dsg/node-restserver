const { request, response } = require("express");
const { Producto } = require('../models');

const obtenerProductos = async ( req = request, res = response ) => {

}

const obtenerProducto = async ( req = request, res = response ) => {
    
}

const crearProducto = async( req = request, res = response ) => {

    const { nombre, precio, categoria, descripcion } = req.body;

    nombre = nombre.toUpperCase();

    const data = {
        nombre, precio, categoria, descripcion, usuario: req.usuario._id,
    }

    console.log( data );
    

    const producto = await new Producto({ data });

    await producto.save();

    res.status(201).json( producto );
    
}

const actualizarProducto = async( req = request, res = response ) => {

}

const eliminarProducto = async( req = request, res = response ) => {

}

module.exports = {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductos,
}