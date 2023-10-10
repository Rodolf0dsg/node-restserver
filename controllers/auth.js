const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const generarJWT = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si correo existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no existe',
            })
        }

        //verificar si el usuario esta activo   

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario inactivo',
            })
        }


        //verificar la contrase;a

        const validPassword = bcrypt.compareSync( password, usuario.password )

        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password',
            })
        }

        
        // generar el JWT

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            msg: 'Hable con el admin'
        })

    }
}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        //Verificar si correo de google ya existe

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) { //si usuario no existe, crearlo

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        //si el usuario en DB tiene el estado false (borrado)

        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Usuario borrado o bloqueado',
            })
        }

        //generar el JWT para hacer el login

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token,
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Algo ha salido mal',
        })
    }

}

module.exports = {
    login,
    googleSignIn
}