const { Router, request } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');

const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { isValidObjectId } = require('mongoose');

const router = Router();


//Obtener todas las categorias - publico

router.get('/', obtenerCategorias )

//Obtener una categoria por id - publico

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos,
], obtenerCategoria )


//Crear categoria - Privado, cualquier persona con un token valido

router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria );

//actualizar categoria por el id - Privado, cualquier persona con un token valido

router.put('/:id', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos,
 ], actualizarCategoria )

//Eliminar categoria por el id - Privado, cualquier persona con un token valido

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'Id no valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos,
], borrarCategoria)

module.exports = router;