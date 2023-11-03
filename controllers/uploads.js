const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const reqst = require('request');
const { subirArchivo } = require("../helpers");
const { Usuario, Producto} = require('../models');
const { validarArchivo } = require("../middlewares");

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );



const cargarArchivo = async( req = request, res = response ) => {
    
    // console.log('req.files >>>', req.files); // eslint-disable-line

    try {

        const nombre = await subirArchivo( req.files, undefined, 'imgs' );

        return res.json({ nombre })

    } catch (error) {
        console.log( error );

        res.status(400).json({ error })

    }
}

const actualizarImagen = async( req = request, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id: ${ id }`
                })
            }


            break;

        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: `Se me olvido validar esto`});
    }

    //limpiar imagenes

    try {

        if ( modelo.img ) {

            const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img  );

            if ( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg ); //Borrar la imagen repetida
            }

        }
        
    } catch (error) {
        
        res.status(400).json( error );

    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );

    modelo.img = nombre;

    await modelo.save()

    res.json( modelo );

}

const mostrarImagen = async( req = request, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id: ${ id }`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: `No existe coleccion`});
    }

    if ( modelo.img ) {

        const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img  );

        if ( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg );
        }

    }

    const pathImg = path.join( __dirname, '../assets', 'noimage.jpg' )

    res.sendFile( pathImg );
        
}

const actualizarImagenCloudinary = async( req = request, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id: ${ id }`
                })
            }


            break;

        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: `No existe coleccion`});
    }


    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );

    }

    const {tempFilePath} = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;
    
    await modelo.save();

    return res.json( modelo );
    
}

const mostrarImagenCloudinary = async( req = request, res = response) => {

    const{ coleccion, id } = req.params;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id: ${ id }`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: `No existe coleccion`});
    }

    const url = modelo.img;

    reqst({
        url: url,
        encoding: null
    }, 
    (err, resp, buffer) => {
        if (!err && resp.statusCode === 200){
            res.set("Content-Type", "image/jpeg");
            res.send(resp.body);
        }
    });
}

module.exports = { 
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}