const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const generarJWT = require("../helpers/generar-jwt");

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

module.exports = {
    login,
}