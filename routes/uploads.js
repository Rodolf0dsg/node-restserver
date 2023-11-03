const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos, validarArchivo } = require('../middlewares/');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads');
const { Producto } = require('../models');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivo ,cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos' ] ) ),
    validarCampos
] , actualizarImagenCloudinary );

router.get('/:coleccion/:id', [
    check('id', 'No es un id de mongo Valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos' ] ) ),
    validarCampos,
], mostrarImagenCloudinary )


module.exports = router;